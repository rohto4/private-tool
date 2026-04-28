import Parser from "rss-parser";
import { initialSources } from "@/lib/sources/initial-sources";

const parser = new Parser({ timeout: 20_000 });

async function checkFeed(source: (typeof initialSources)[number]) {
  try {
    const feed = await parser.parseURL(source.feedUrl);
    return {
      sourceKey: source.sourceKey,
      displayName: source.displayName,
      feedUrl: source.feedUrl,
      isActive: source.isActive,
      ok: true,
      itemCount: feed.items.length,
      title: feed.title
    };
  } catch (error) {
    return {
      sourceKey: source.sourceKey,
      displayName: source.displayName,
      feedUrl: source.feedUrl,
      isActive: source.isActive,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function main() {
  const results = [];
  for (const source of initialSources) {
    results.push(await checkFeed(source));
  }

  console.log(JSON.stringify(results, null, 2));

  if (results.some((result) => result.isActive && (!result.ok || result.itemCount === 0))) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
