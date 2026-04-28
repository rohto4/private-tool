import { prisma } from "@/lib/db/client";
import { postSlackText } from "@/lib/slack/client";
import { formatDailySummary } from "@/lib/slack/summary";
import { getJstDayRange } from "@/lib/time/jst";

export type DailyFeedSummary = {
  date: string;
  fetched: Record<string, number>;
  sent: Record<string, number>;
  skipped: Record<string, number>;
};

export async function buildDailyFeedSummary(now = new Date()): Promise<DailyFeedSummary> {
  const { label, start, end } = getJstDayRange(now);
  const channelKeys = ["feed_ai", "feed_tech", "feed_other"] as const;

  const summary: DailyFeedSummary = {
    date: label,
    fetched: {},
    sent: {},
    skipped: {}
  };

  for (const channelKey of channelKeys) {
    summary.fetched[channelKey] = await prisma.feedItem.count({
      where: {
        channelKey,
        createdAt: { gte: start, lt: end }
      }
    });
    summary.sent[channelKey] = await prisma.feedItem.count({
      where: {
        channelKey,
        sentAt: { gte: start, lt: end }
      }
    });
    summary.skipped[channelKey] = await prisma.feedItem.count({
      where: {
        channelKey,
        skippedAt: { gte: start, lt: end }
      }
    });
  }

  return summary;
}

export async function postDailyFeedSummary(now = new Date()): Promise<DailyFeedSummary> {
  const summary = await buildDailyFeedSummary(now);
  await postSlackText({
    channelKey: "feed_other",
    text: formatDailySummary(summary)
  });
  return summary;
}
