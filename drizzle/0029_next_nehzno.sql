ALTER TABLE "location" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."location_type_enum";--> statement-breakpoint
CREATE TYPE "public"."location_type_enum" AS ENUM('TOWN', 'MAP');--> statement-breakpoint
ALTER TABLE "location" ALTER COLUMN "type" SET DATA TYPE "public"."location_type_enum" USING "type"::"public"."location_type_enum";