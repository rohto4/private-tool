import type { DailyFeedSummary } from "@/lib/jobs/daily-summary";
import type { HourlyJobSummary } from "@/lib/jobs/hourly";
import type { SlackPostingSummary } from "@/lib/slack/posting";

const labels = {
  feed_ai: "#feed-ai",
  feed_tech: "#feed-tech",
  feed_other: "#feed-other"
};

export function formatHourlyResult(input: {
  fetch: HourlyJobSummary;
  posting?: SlackPostingSummary;
}): string {
  const lines = [
    "Feed job finished.",
    `sources: ${input.fetch.sourcesSucceeded}/${input.fetch.sourcesTotal} succeeded`,
    `items: fetched=${input.fetch.fetchedItems}, inserted=${input.fetch.insertedItems}, duplicates=${input.fetch.duplicateItems}`
  ];

  if (input.posting) {
    lines.push(
      `posted: ai=${input.posting.posted.feed_ai}, tech=${input.posting.posted.feed_tech}, other=${input.posting.posted.feed_other}`,
      `skipped: ai=${input.posting.skipped.feed_ai}, tech=${input.posting.skipped.feed_tech}, other=${input.posting.skipped.feed_other}`
    );
  }

  if (input.fetch.failures.length > 0 || (input.posting?.failures.length ?? 0) > 0) {
    lines.push("failures exist. Check job logs.");
  }

  return lines.join("\n");
}

export function formatDailySummary(summary: DailyFeedSummary): string {
  const lines = [`${summary.date} feed summary`];

  for (const channelKey of ["feed_ai", "feed_tech", "feed_other"] as const) {
    lines.push(
      `${labels[channelKey]}: fetched=${summary.fetched[channelKey] ?? 0}, sent=${summary.sent[channelKey] ?? 0}, skipped=${summary.skipped[channelKey] ?? 0}`
    );
  }

  return lines.join("\n");
}
