import { createHmac, timingSafeEqual } from "node:crypto";
import { requireEnv } from "@/lib/config/env";

const maxSkewSeconds = 60 * 5;

export function verifySlackRequest(input: {
  body: string;
  timestamp: string | null;
  signature: string | null;
  now?: number;
}): boolean {
  if (!input.timestamp || !input.signature) {
    return false;
  }

  const timestampNumber = Number(input.timestamp);
  if (!Number.isFinite(timestampNumber)) {
    return false;
  }

  const now = input.now ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNumber) > maxSkewSeconds) {
    return false;
  }

  const base = `v0:${input.timestamp}:${input.body}`;
  const expected = `v0=${createHmac("sha256", requireEnv("SLACK_SIGNING_SECRET")).update(base).digest("hex")}`;

  const actualBuffer = Buffer.from(input.signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}
