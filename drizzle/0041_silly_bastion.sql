CREATE TYPE "public"."town_name_type_enum" AS ENUM('SOLMERE');--> statement-breakpoint
ALTER TYPE "public"."tile_type_enum" ADD VALUE 'TOWN';--> statement-breakpoint
CREATE TABLE "town" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buildingType" "building" NOT NULL,
	"name" "town_name_type_enum" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tile" ADD COLUMN "townId" uuid;--> statement-breakpoint
ALTER TABLE "tile" ADD CONSTRAINT "tile_townId_town_id_fk" FOREIGN KEY ("townId") REFERENCES "public"."town"("id") ON DELETE set null ON UPDATE no action;