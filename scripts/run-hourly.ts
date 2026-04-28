import { prisma } from "@/lib/db/client";
import { runHourlyFeedJob } from "@/lib/jobs/hourly";
import { postSlackText } from "@/lib/slack/client";
import { formatHourlyResult } from "@/lib/slack/summary";

runHourlyFeedJob(process.env.GITHUB_ACTIONS ? "github_actions" : "local")
  .then(async (summary) => {
    console.log(JSON.stringify(summary, null, 2));
    if (summary.failures.length > 0 || (summary.posting?.failures.length ?? 0) > 0) {
      await postSlackText({
        channelKey: "feed_other",
        text: formatHourlyResult({ fetch: summary, posting: summary.posting })
      });
    }
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
