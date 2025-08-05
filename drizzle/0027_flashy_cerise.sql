CREATE TYPE "public"."action_type_enum" AS ENUM('WALK', 'CRAFT', 'IDLE');--> statement-breakpoint
CREATE TYPE "public"."building" AS ENUM('MAGIC-SHOP', 'NONE');--> statement-breakpoint
CREATE TYPE "public"."location_type_enum" AS ENUM('CITY', 'MAP');--> statement-breakpoint
CREATE TABLE "action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "action_type_enum" NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "location_type_enum" NOT NULL,
	"buildingType" "building" NOT NULL,
	"x" integer,
	"y" integer,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "actionId" uuid;--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "locationId" uuid;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_actionId_action_id_fk" FOREIGN KEY ("actionId") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;