-- Optional display fields for the product technical table section
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "technicalTableTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "technicalTableColumnLabels" JSONB;
