import type { ChannelKey, FeedItem } from "@generated/prisma";
import { prisma } from "@/lib/db/client";
import { getJstDayRange } from "@/lib/time/jst";
import { getSlackClient, requireSlackChannelId } from "@/lib/slack/client";
import { buildFeedItemBlocks } from "@/lib/slack/blocks";

const dailyLimits: Record<ChannelKey, number> = {
  feed_ai: 10,
  feed_tech: 10,
  feed_other: 20
};

const channelKeys = ["feed_ai", "feed_tech", "feed_other"] as const;

export type SlackPostingSummary = {
  posted: Record<ChannelKey, number>;
  skipped: Record<ChannelKey, number>;
  failures: Array<{ feedItemId: string; message: string }>;
};

function emptyCounts(): Record<ChannelKey, number> {
  return {
    feed_ai: 0,
    feed_tech: 0,
    feed_other: 0
  };
}

async function markOlderUnsentAsSkipped(start: Date): Promise<Record<ChannelKey, number>> {
  const skipped = emptyCounts();

  for (const channelKey of channelKeys) {
    const result = await prisma.feedItem.updateMany({
      where: {
        channelKey,
        isSent: false,
        skippedAt: null,
        createdAt: { lt: start }
      },
      data: {
        skippedAt: new Date(),
        skipReason: "expired_daily_window"
      }
    });
    skipped[channelKey] += result.count;
  }

  return skipped;
}

async function markLimitExceededAsSkipped(input: {
  channelKey: ChannelKey;
  keepIds: string[];
  start: Date;
  end: Date;
}): Promise<number> {
  const result = await prisma.feedItem.updateMany({
    where: {
      channelKey: input.channelKey,
      isSent: false,
      skippedAt: null,
      createdAt: { gte: input.start, lt: input.end },
      feedItemId: { notIn: input.keepIds }
    },
    data: {
      skippedAt: new Date(),
      skipReason: "daily_limit_exceeded"
    }
  });

  return result.count;
}

async function postFeedItem(feedItem: FeedItem): Promise<string | undefined> {
  const response = await getSlackClient().chat.postMessage({
    channel: requireSlackChannelId(feedItem.channelKey),
    text: feedItem.title,
    blocks: buildFeedItemBlocks(feedItem)
  });

  return response.ts;
}

export async function postPendingFeedItemsToSlack(now = new Date()): Promise<SlackPostingSummary> {
  const { start, end } = getJstDayRange(now);
  const summary: SlackPostingSummary = {
    posted: emptyCounts(),
    skipped: await markOlderUnsentAsSkipped(start),
    failures: []
  };

  for (const channelKey of channelKeys) {
    const sentToday = await prisma.feedItem.count({
      where: {
        channelKey,
        sentAt: { gte: start, lt: end }
      }
    });
    const remaining = Math.max(dailyLimits[channelKey] - sentToday, 0);

    const candidates = await prisma.feedItem.findMany({
      where: {
        channelKey,
        isSent: false,
        skippedAt: null,
        createdAt: { gte: start, lt: end }
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: remaining
    });

    summary.skipped[channelKey] += await markLimitExceededAsSkipped({
      channelKey,
      keepIds: candidates.map((candidate) => candidate.feedItemId),
      start,
      end
    });

    for (const feedItem of candidates) {
      try {
        const ts = await postFeedItem(feedItem);
        await prisma.feedItem.update({
          where: { feedItemId: feedItem.feedItemId },
          data: {
            isSent: true,
            sentAt: new Date()
          }
        });
        await prisma.deliveryLog.create({
          data: {
            feedItemId: feedItem.feedItemId,
            deliveryType: "slack",
            channelKey,
            targetId: requireSlackChannelId(channelKey),
            status: "success",
            externalTs: ts
          }
        });
        summary.posted[channelKey] += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        summary.failures.push({ feedItemId: feedItem.feedItemId, message });
        await prisma.deliveryLog.create({
          data: {
            feedItemId: feedItem.feedItemId,
            deliveryType: "slack",
            channelKey,
            targetId: requireSlackChannelId(channelKey),
            status: "failed",
            errorMessage: message
          }
        });
      }
    }
  }

  return summary;
}
