import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env.local" });
config({ path: ".env" });

const envSchema = z.object({
  DATABASE_URL: optionalEnvString(),
  DATABASE_URL_UNPOOLED: optionalEnvString(),
  SLACK_BOT_TOKEN: optionalEnvString(),
  SLACK_SIGNING_SECRET: optionalEnvString(),
  SLACK_CHANNEL_FEED_AI: optionalEnvString(),
  SLACK_CHANNEL_FEED_TECH: optionalEnvString(),
  SLACK_CHANNEL_FEED_OTHER: optionalEnvString(),
  MISSKEY_API_TOKEN: optionalEnvString(),
  MISSKEY_BASE_URL: z.string().url().default("https://misskey.io")
});

function optionalEnvString() {
  return z.preprocess((value) => (value === "" ? undefined : value), z.string().min(1).optional());
}

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  return envSchema.parse(process.env);
}

export function requireEnv<K extends keyof AppEnv>(key: K): NonNullable<AppEnv[K]> {
  const value = getEnv()[key];
  if (!value) {
    throw new Error(`${String(key)} is not configured`);
  }
  return value as NonNullable<AppEnv[K]>;
}
