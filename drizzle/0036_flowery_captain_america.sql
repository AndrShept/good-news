CREATE TYPE "public"."tile_type_enum" AS ENUM('OBJECT', 'DECOR', 'GROUND');--> statement-breakpoint
CREATE TYPE "public"."map_name_type_enum" AS ENUM('SOLMERE');--> statement-breakpoint
CREATE TYPE "public"."pvp_type_enum" AS ENUM('PVE', 'PVP');--> statement-breakpoint
ALTER TYPE "public"."building" ADD VALUE 'LEAVE-TOWN';--> statement-breakpoint
CREATE TABLE "tile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "tile_type_enum",
	"mapId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "map" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "map_name_type_enum" NOT NULL,
	"pvpMode" "pvp_type_enum" NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "mapId" uuid;--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "tileId" uuid;--> statement-breakpoint
ALTER TABLE "tile" ADD CONSTRAINT "tile_mapId_map_id_fk" FOREIGN KEY ("mapId") REFERENCES "public"."map"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_mapId_map_id_fk" FOREIGN KEY ("mapId") REFERENCES "public"."map"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_tileId_tile_id_fk" FOREIGN KEY ("tileId") REFERENCES "public"."tile"("id") ON DELETE set null ON UPDATE no action;