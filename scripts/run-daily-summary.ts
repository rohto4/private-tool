import { prisma } from "@/lib/db/client";
import { postDailyFeedSummary } from "@/lib/jobs/daily-summary";

postDailyFeedSummary()
  .then((summary) => {
    console.log(JSON.stringify(summary, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
