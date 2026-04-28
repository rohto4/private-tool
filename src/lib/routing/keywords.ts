import type { ChannelKey } from "@generated/prisma";

const aiKeywords = [
  "ai",
  "生成ai",
  "人工知能",
  "llm",
  "chatgpt",
  "openai",
  "claude",
  "anthropic",
  "gemini",
  "deepmind",
  "copilot",
  "rag",
  "agent",
  "エージェント",
  "機械学習",
  "ディープラーニング"
];

const techKeywords = [
  "software",
  "developer",
  "programming",
  "security",
  "cloud",
  "aws",
  "google cloud",
  "azure",
  "web",
  "api",
  "database",
  "スマホ",
  "ガジェット",
  "セキュリティ",
  "クラウド",
  "開発",
  "プログラミング"
];

function findMatches(text: string, keywords: string[]): string[] {
  const normalizedText = text.toLowerCase();
  return keywords.filter((keyword) => normalizedText.includes(keyword.toLowerCase()));
}

export type ChannelDecision = {
  channelKey: ChannelKey;
  matchedKeywords: string[];
};

export function decideChannel(input: {
  title: string;
  descriptionText?: string | null;
  fallbackChannelKey: ChannelKey;
}): ChannelDecision {
  const text = `${input.title}\n${input.descriptionText ?? ""}`;
  const aiMatches = findMatches(text, aiKeywords);
  if (aiMatches.length > 0) {
    return { channelKey: "feed_ai", matchedKeywords: aiMatches };
  }

  const techMatches = findMatches(text, techKeywords);
  if (techMatches.length > 0 || input.fallbackChannelKey === "feed_tech") {
    return { channelKey: "feed_tech", matchedKeywords: techMatches };
  }

  return { channelKey: input.fallbackChannelKey, matchedKeywords: [] };
}
