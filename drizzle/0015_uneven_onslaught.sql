ALTER TABLE "inventory_item" RENAME COLUMN "heroId" TO "inventoryHeroId";--> statement-breakpoint
ALTER TABLE "inventory_item" DROP CONSTRAINT "inventory_item_heroId_hero_id_fk";
--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_inventoryHeroId_hero_id_fk" FOREIGN KEY ("inventoryHeroId") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;