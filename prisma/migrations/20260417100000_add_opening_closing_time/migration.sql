-- Migration: add openingTime and closingTime to Organization
-- Safe: columns have DEFAULT values → no data loss, no NULL issues.

-- AlterTable
ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "openingTime" TEXT NOT NULL DEFAULT '08:00',
  ADD COLUMN IF NOT EXISTS "closingTime" TEXT NOT NULL DEFAULT '20:00';

