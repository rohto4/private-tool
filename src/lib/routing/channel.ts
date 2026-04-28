import type { ChannelKey, SourceCategory } from "@generated/prisma";
import { getEnv } from "@/lib/config/env";

export const channelKeys = ["feed_ai", "feed_tech", "feed_other"] as const satisfies readonly ChannelKey[];

export function defaultChannelForSourceCategory(category: SourceCategory): ChannelKey {
  if (category === "ai") {
    return "feed_ai";
  }

  if (category === "tech") {
    return "feed_tech";
  }

  return "feed_other";
}

export function getSlackChannelId(channelKey: ChannelKey): string | undefined {
  const env = getEnv();

  const channelByKey: Record<ChannelKey, string | undefined> = {
    feed_ai: env.SLACK_CHANNEL_FEED_AI,
    feed_tech: env.SLACK_CHANNEL_FEED_TECH,
    feed_other: env.SLACK_CHANNEL_FEED_OTHER
  };

  return channelByKey[channelKey];
}
