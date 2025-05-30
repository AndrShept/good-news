CREATE TYPE "public"."weapon_type_enum" AS ENUM('DAGGER', 'SWORD', 'AXE', 'STAFF');--> statement-breakpoint
ALTER TABLE "game_item" ADD COLUMN "weaponType" "weapon_type_enum";--> statement-breakpoint
ALTER TABLE "public"."game_item" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."game_item_enum";--> statement-breakpoint
CREATE TYPE "public"."game_item_enum" AS ENUM('POTION', 'BOOK', 'WEAPON', 'CHESTPLATE', 'BELT', 'BOOTS', 'HELMET', 'LEGS', 'SHIELD', 'RING', 'AMULET', 'MISC');--> statement-breakpoint
ALTER TABLE "public"."game_item" ALTER COLUMN "type" SET DATA TYPE "public"."game_item_enum" USING "type"::"public"."game_item_enum";