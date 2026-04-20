-- Add recurrence support to Unavailability
ALTER TABLE "Unavailability" ADD COLUMN "recurrence" TEXT NOT NULL DEFAULT 'NONE';
ALTER TABLE "Unavailability" ADD COLUMN "recurrenceGroupId" TEXT;

CREATE INDEX "Unavailability_recurrenceGroupId_idx" ON "Unavailability"("recurrenceGroupId");

