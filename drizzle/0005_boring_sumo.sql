CREATE TYPE "public"."equipment_slot" AS ENUM('RIGHT_HAND', 'LEFT_HAND', 'HELMET', 'CHESTPLATE', 'LEGS', 'BOOTS', 'AMULET', 'RING_LEFT', 'RING_RIGHT', 'BELT');--> statement-breakpoint
CREATE TYPE "public"."game_item" AS ENUM('POTION', 'BOOK', 'DAGGER', 'SWORD', 'AXE', 'STAFF', 'CHESTPLATE', 'BELT', 'BOOTS', 'HELMET', 'LEGS', 'SHIELD', 'RING', 'AMULET', 'MISC');--> statement-breakpoint
CREATE TYPE "public"."rarity" AS ENUM('COMMON', 'MAGIC', 'EPIC', 'RARE', 'LEGENDARY');--> statement-breakpoint
CREATE TYPE "public"."weapon_hand" AS ENUM('ONE_HANDED', 'TWO_HANDED');--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" text PRIMARY KEY NOT NULL,
	"slot" "equipment_slot" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"heroId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_item" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "game_item" NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"duration" integer DEFAULT 0 NOT NULL,
	"modifierId" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_item" (
	"id" text PRIMARY KEY NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"gameItemId" text NOT NULL,
	"heroId" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "maxHealth" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "maxMana" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_heroId_hero_id_fk" FOREIGN KEY ("heroId") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_item" ADD CONSTRAINT "game_item_modifierId_modifier_id_fk" FOREIGN KEY ("modifierId") REFERENCES "public"."modifier"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_gameItemId_game_item_id_fk" FOREIGN KEY ("gameItemId") REFERENCES "public"."game_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_heroId_hero_id_fk" FOREIGN KEY ("heroId") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;