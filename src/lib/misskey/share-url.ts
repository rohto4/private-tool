import { getEnv } from "@/lib/config/env";

export function buildMisskeyShareUrl(input: { title: string; url: string }): string {
  const baseUrl = getEnv().MISSKEY_BASE_URL;
  const text = `${input.title}\n${input.url}`;
  const shareUrl = new URL("/share", baseUrl);
  shareUrl.searchParams.set("text", text);
  return shareUrl.toString();
}
