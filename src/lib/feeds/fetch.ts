import Parser from "rss-parser";
import type { Prisma, SourceTarget } from "@generated/prisma";
import { createTitleSignature, normalizeUrl, stripHtml, truncateText } from "@/lib/feeds/normalize";
import { decideChannel } from "@/lib/routing/keywords";

const parser = new Parser({
  timeout: 20_000
});

export type NormalizedFeedEntry = {
  sourceItemId: string | null;
  sourceUrl: string;
  normalizedUrl: string;
  title: string;
  description: string | null;
  descriptionText: string | null;
  author: string | null;
  publishedAt: Date | null;
  sourceUpdatedAt: Date | null;
  rawGuid: string | null;
  rawMeta: Prisma.InputJsonValue;
  titleSignature: string;
  matchedKeywords: string[];
  channelKey: SourceTarget["defaultChannelKey"];
};

function parseDate(value: string | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function fetchSourceFeed(source: SourceTarget): Promise<NormalizedFeedEntry[]> {
  const feed = await parser.parseURL(source.feedUrl);

  return feed.items.flatMap((item) => {
    const sourceUrl = item.link ?? item.guid;
    const title = item.title?.trim();

    if (!sourceUrl || !title) {
      return [];
    }

    const normalizedUrl = normalizeUrl(sourceUrl);
    const description = item.contentSnippet ?? item.content ?? item.summary ?? null;
    const descriptionText = truncateText(stripHtml(description), 500);
    const channelDecision = decideChannel({
      title,
      descriptionText,
      fallbackChannelKey: source.defaultChannelKey
    });

    return [
      {
        sourceItemId: item.guid ?? null,
        sourceUrl,
        normalizedUrl,
        title,
        description,
        descriptionText,
        author: item.creator ?? item.author ?? null,
        publishedAt: parseDate(item.isoDate ?? item.pubDate),
        sourceUpdatedAt: parseDate(item.isoDate ?? item.pubDate),
        rawGuid: item.guid ?? null,
        rawMeta: JSON.parse(JSON.stringify(item)) as Prisma.InputJsonValue,
        titleSignature: createTitleSignature(title),
        matchedKeywords: channelDecision.matchedKeywords,
        channelKey: channelDecision.channelKey
      }
    ];
  });
}
