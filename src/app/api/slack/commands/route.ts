import { after, type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { runHourlyFeedJob } from "@/lib/jobs/hourly";
import { postSlackText } from "@/lib/slack/client";
import { formatHourlyResult } from "@/lib/slack/summary";
import { verifySlackRequest } from "@/lib/slack/verify";

export async function POST(request: NextRequest) {
  const body = await request.text();
  if (
    !verifySlackRequest({
      body,
      timestamp: request.headers.get("x-slack-request-timestamp"),
      signature: request.headers.get("x-slack-signature")
    })
  ) {
    return NextResponse.json({ text: "invalid signature" }, { status: 401 });
  }

  const form = new URLSearchParams(body);
  const command = form.get("command");
  if (command !== "/pt-fetch") {
    return NextResponse.json({
      response_type: "ephemeral",
      text: `Unsupported command: ${command ?? "(none)"}`
    });
  }

  after(async () => {
    try {
      const summary = await runHourlyFeedJob("slack_command");
      await postSlackText({
        channelKey: "feed_other",
        text: formatHourlyResult({ fetch: summary, posting: summary.posting })
      });
    } catch (error) {
      await postSlackText({
        channelKey: "feed_other",
        text: `Feed job failed: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      await prisma.$disconnect();
    }
  });

  return NextResponse.json({
    response_type: "ephemeral",
    text: "Feed fetch started. Result will be posted to #feed-other."
  });
}
