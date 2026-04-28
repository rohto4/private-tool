import { WebClient } from "@slack/web-api";
import type { ChannelKey } from "@generated/prisma";
import { requireEnv } from "@/lib/config/env";
import { getSlackChannelId } from "@/lib/routing/channel";

let slackClient: WebClient | undefined;

export function getSlackClient(): WebClient {
  slackClient ??= new WebClient(requireEnv("SLACK_BOT_TOKEN"));
  return slackClient;
}

export function requireSlackChannelId(channelKey: ChannelKey): string {
  const channelId = getSlackChannelId(channelKey);
  if (!channelId) {
    throw new Error(`Slack channel id is not configured for ${channelKey}`);
  }
  return channelId;
}

export async function postSlackText(input: {
  channelKey: ChannelKey;
  text: string;
}): Promise<string | undefined> {
  const response = await getSlackClient().chat.postMessage({
    channel: requireSlackChannelId(input.channelKey),
    text: input.text
  });

  return response.ts;
}
