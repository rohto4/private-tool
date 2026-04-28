-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('rss');

-- CreateEnum
CREATE TYPE "SourceCategory" AS ENUM ('ai', 'tech', 'other');

-- CreateEnum
CREATE TYPE "ChannelKey" AS ENUM ('feed_ai', 'feed_tech', 'feed_other');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('slack', 'misskey');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('success', 'failed', 'skipped');

-- CreateEnum
CREATE TYPE "JobTriggerKind" AS ENUM ('github_actions', 'slack_command', 'local');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('running', 'success', 'failed');

-- CreateTable
CREATE TABLE "source_targets" (
    "source_target_id" TEXT NOT NULL,
    "source_key" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "feed_url" TEXT NOT NULL,
    "source_kind" "SourceKind" NOT NULL DEFAULT 'rss',
    "source_category" "SourceCategory" NOT NULL,
    "default_channel_key" "ChannelKey" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_targets_pkey" PRIMARY KEY ("source_target_id")
);

-- CreateTable
CREATE TABLE "feed_items" (
    "feed_item_id" TEXT NOT NULL,
    "source_target_id" TEXT NOT NULL,
    "source_item_id" TEXT,
    "source_url" TEXT NOT NULL,
    "normalized_url" TEXT NOT NULL,
    "canonical_url" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "description_text" TEXT,
    "author" TEXT,
    "published_at" TIMESTAMP(3),
    "source_updated_at" TIMESTAMP(3),
    "raw_guid" TEXT,
    "raw_meta" JSONB,
    "title_signature" TEXT,
    "matched_keywords" JSONB,
    "channel_key" "ChannelKey" NOT NULL,
    "is_sent" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3),
    "skipped_at" TIMESTAMP(3),
    "skip_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_items_pkey" PRIMARY KEY ("feed_item_id")
);

-- CreateTable
CREATE TABLE "delivery_logs" (
    "delivery_log_id" TEXT NOT NULL,
    "feed_item_id" TEXT NOT NULL,
    "delivery_type" "DeliveryType" NOT NULL,
    "channel_key" "ChannelKey",
    "target_id" TEXT,
    "status" "DeliveryStatus" NOT NULL,
    "external_ts" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_logs_pkey" PRIMARY KEY ("delivery_log_id")
);

-- CreateTable
CREATE TABLE "job_runs" (
    "job_run_id" TEXT NOT NULL,
    "job_name" TEXT NOT NULL,
    "trigger_kind" "JobTriggerKind" NOT NULL,
    "status" "JobStatus" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "summary" JSONB,
    "error_message" TEXT,

    CONSTRAINT "job_runs_pkey" PRIMARY KEY ("job_run_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "source_targets_source_key_key" ON "source_targets"("source_key");

-- CreateIndex
CREATE INDEX "feed_items_normalized_url_idx" ON "feed_items"("normalized_url");

-- CreateIndex
CREATE INDEX "feed_items_title_signature_idx" ON "feed_items"("title_signature");

-- CreateIndex
CREATE INDEX "feed_items_is_sent_created_at_idx" ON "feed_items"("is_sent", "created_at");

-- CreateIndex
CREATE INDEX "feed_items_channel_key_created_at_idx" ON "feed_items"("channel_key", "created_at");

-- CreateIndex
CREATE INDEX "delivery_logs_feed_item_id_delivery_type_idx" ON "delivery_logs"("feed_item_id", "delivery_type");

-- CreateIndex
CREATE INDEX "job_runs_job_name_started_at_idx" ON "job_runs"("job_name", "started_at");

-- AddForeignKey
ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_source_target_id_fkey" FOREIGN KEY ("source_target_id") REFERENCES "source_targets"("source_target_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_logs" ADD CONSTRAINT "delivery_logs_feed_item_id_fkey" FOREIGN KEY ("feed_item_id") REFERENCES "feed_items"("feed_item_id") ON DELETE CASCADE ON UPDATE CASCADE;
