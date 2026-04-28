import type { JobRun } from "@generated/prisma";
import { prisma } from "@/lib/db/client";
import { fetchSourceFeed } from "@/lib/feeds/fetch";
import { postPendingFeedItemsToSlack, type SlackPostingSummary } from "@/lib/slack/posting";

export type HourlyJobSummary = {
  sourcesTotal: number;
  sourcesSucceeded: number;
  sourcesFailed: number;
  fetchedItems: number;
  insertedItems: number;
  duplicateItems: number;
  posting?: SlackPostingSummary;
  failures: Array<{ sourceKey: string; message: string }>;
};

export async function runHourlyFeedJob(triggerKind: JobRun["triggerKind"]): Promise<HourlyJobSummary> {
  const jobRun = await prisma.jobRun.create({
    data: {
      jobName: "hourly-feed",
      triggerKind,
      status: "running"
    }
  });

  const summary: HourlyJobSummary = {
    sourcesTotal: 0,
    sourcesSucceeded: 0,
    sourcesFailed: 0,
    fetchedItems: 0,
    insertedItems: 0,
    duplicateItems: 0,
    failures: []
  };

  try {
    const sources = await prisma.sourceTarget.findMany({
      where: { isActive: true },
      orderBy: { sourceKey: "asc" }
    });

    summary.sourcesTotal = sources.length;

    for (const source of sources) {
      try {
        const entries = await fetchSourceFeed(source);
        summary.fetchedItems += entries.length;

        for (const entry of entries) {
          const existing = await prisma.feedItem.findFirst({
            where: {
              OR: [
                { normalizedUrl: entry.normalizedUrl },
                { titleSignature: entry.titleSignature }
              ]
            },
            select: { feedItemId: true }
          });

          if (existing) {
            summary.duplicateItems += 1;
            continue;
          }

          await prisma.feedItem.create({
            data: {
              sourceTargetId: source.sourceTargetId,
              ...entry,
              matchedKeywords: entry.matchedKeywords
            }
          });
          summary.insertedItems += 1;
        }

        summary.sourcesSucceeded += 1;
      } catch (error) {
        summary.sourcesFailed += 1;
        summary.failures.push({
          sourceKey: source.sourceKey,
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }

    summary.posting = await postPendingFeedItemsToSlack();

    await prisma.jobRun.update({
      where: { jobRunId: jobRun.jobRunId },
      data: {
        status: summary.sourcesFailed > 0 ? "failed" : "success",
        finishedAt: new Date(),
        summary
      }
    });

    return summary;
  } catch (error) {
    await prisma.jobRun.update({
      where: { jobRunId: jobRun.jobRunId },
      data: {
        status: "failed",
        finishedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : String(error),
        summary
      }
    });
    throw error;
  }
}
