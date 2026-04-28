import type { ChannelKey, SourceCategory } from "@generated/prisma";
import { defaultChannelForSourceCategory } from "@/lib/routing/channel";

export type InitialSource = {
  sourceKey: string;
  displayName: string;
  siteUrl: string;
  feedUrl: string;
  sourceCategory: SourceCategory;
  defaultChannelKey: ChannelKey;
  isActive: boolean;
  notes?: string;
};

function source(input: Omit<InitialSource, "defaultChannelKey">): InitialSource {
  return {
    ...input,
    defaultChannelKey: defaultChannelForSourceCategory(input.sourceCategory)
  };
}

export const initialSources: InitialSource[] = [
  source({
    sourceKey: "ainow",
    displayName: "AINOW",
    siteUrl: "https://ainow.ai/",
    feedUrl: "https://ainow.ai/feed/",
    sourceCategory: "ai",
    isActive: true,
    notes: "Verified by source:check on 2026-04-28."
  }),
  source({
    sourceKey: "ledge-ai",
    displayName: "Ledge.ai",
    siteUrl: "https://ledge.ai/",
    feedUrl: "https://ledge.ai/feed.xml",
    sourceCategory: "ai",
    isActive: false,
    notes: "Feed URL must be verified before activation."
  }),
  source({
    sourceKey: "aismiley",
    displayName: "AIsmiley",
    siteUrl: "https://aismiley.co.jp/",
    feedUrl: "https://aismiley.co.jp/feed/",
    sourceCategory: "ai",
    isActive: false,
    notes: "Feed parses but returned 0 items on 2026-04-28. Keep inactive until a usable content feed is found."
  }),
  source({
    sourceKey: "itmedia-aiplus",
    displayName: "ITmedia AI+",
    siteUrl: "https://www.itmedia.co.jp/aiplus/",
    feedUrl: "https://rss.itmedia.co.jp/rss/2.0/aiplus.xml",
    sourceCategory: "ai",
    isActive: true,
    notes: "Verified by source:check on 2026-04-28."
  }),
  source({
    sourceKey: "gizmodo-jp",
    displayName: "Gizmodo Japan",
    siteUrl: "https://www.gizmodo.jp/",
    feedUrl: "https://www.gizmodo.jp/index.xml",
    sourceCategory: "tech",
    isActive: true,
    notes: "Verified by source:check on 2026-04-28."
  }),
  source({
    sourceKey: "itmedia",
    displayName: "ITmedia",
    siteUrl: "https://www.itmedia.co.jp/",
    feedUrl: "https://rss.itmedia.co.jp/rss/2.0/topstory.xml",
    sourceCategory: "tech",
    isActive: true,
    notes: "Verified by source:check on 2026-04-28."
  }),
  source({
    sourceKey: "cnet-japan",
    displayName: "CNET Japan",
    siteUrl: "https://japan.cnet.com/",
    feedUrl: "https://japan.cnet.com/rss/index.rdf",
    sourceCategory: "tech",
    isActive: true,
    notes: "Verified by source:check on 2026-04-28."
  }),
  source({
    sourceKey: "menthas",
    displayName: "Menthas",
    siteUrl: "https://menthas.com/",
    feedUrl: "https://menthas.com/all/rss",
    sourceCategory: "tech",
    isActive: true,
    notes: "Verified by source:check on 2026-04-28."
  })
];
