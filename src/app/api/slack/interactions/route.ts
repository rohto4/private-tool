import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { buildMisskeyNoteText, createMisskeyNote } from "@/lib/misskey/client";
import { verifySlackRequest } from "@/lib/slack/verify";

type SlackInteractionPayload = {
  actions?: Array<{
    action_id?: string;
    value?: string;
  }>;
};

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
  const payloadText = form.get("payload");
  if (!payloadText) {
    return NextResponse.json({ response_type: "ephemeral", text: "Missing payload" }, { status: 400 });
  }

  const payload = JSON.parse(payloadText) as SlackInteractionPayload;
  const action = payload.actions?.[0];
  if (action?.action_id !== "misskey_post" || !action.value) {
    return NextResponse.json({ response_type: "ephemeral", text: "Unsupported action" });
  }

  const feedItem = await prisma.feedItem.findUnique({
    where: { feedItemId: action.value }
  });
  if (!feedItem) {
    return NextResponse.json({ response_type: "ephemeral", text: "Feed item not found" }, { status: 404 });
  }

  try {
    const articleUrl = feedItem.canonicalUrl ?? feedItem.normalizedUrl;
    const result = await createMisskeyNote(
      buildMisskeyNoteText({
        title: feedItem.title,
        url: articleUrl
      })
    );
    await prisma.deliveryLog.create({
      data: {
        feedItemId: feedItem.feedItemId,
        deliveryType: "misskey",
        status: "success",
        externalTs: result.createdNote?.id
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.deliveryLog.create({
      data: {
        feedItemId: feedItem.feedItemId,
        deliveryType: "misskey",
        status: "failed",
        errorMessage: message
      }
    });
    return NextResponse.json({ response_type: "ephemeral", text: `Misskey post failed: ${message}` });
  }

  return NextResponse.json({
    response_type: "ephemeral",
    text: "Posted to Misskey."
  });
}
