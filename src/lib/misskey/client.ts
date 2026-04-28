import { requireEnv, getEnv } from "@/lib/config/env";

export type MisskeyNoteResponse = {
  createdNote?: {
    id: string;
  };
};

export async function createMisskeyNote(text: string): Promise<MisskeyNoteResponse> {
  const baseUrl = getEnv().MISSKEY_BASE_URL;
  const response = await fetch(new URL("/api/notes/create", baseUrl), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      i: requireEnv("MISSKEY_API_TOKEN"),
      text
    })
  });

  if (!response.ok) {
    throw new Error(`Misskey API failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as MisskeyNoteResponse;
}

export function buildMisskeyNoteText(input: { title: string; url: string }): string {
  return `${input.title}\n${input.url}`;
}
