import type { KnownBlock } from "@slack/types";
import type { FeedItem } from "@generated/prisma";
import { buildMisskeyShareUrl } from "@/lib/misskey/share-url";

export function buildFeedItemBlocks(feedItem: FeedItem): KnownBlock[] {
  const articleUrl = feedItem.canonicalUrl ?? feedItem.normalizedUrl;
  const summary = feedItem.descriptionText ?? "No summary";

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*<${articleUrl}|${feedItem.title}>*\n${summary}`
      }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Misskeyで開く"
          },
          url: buildMisskeyShareUrl({
            title: feedItem.title,
            url: articleUrl
          })
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Misskeyに投稿"
          },
          action_id: "misskey_post",
          value: feedItem.feedItemId,
          style: "primary"
        }
      ]
    }
  ];
}
