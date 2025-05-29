ALTER TABLE "equipment" RENAME COLUMN "heroId" TO "equipmentHeroId";--> statement-breakpoint
ALTER TABLE "equipment" DROP CONSTRAINT "equipment_heroId_hero_id_fk";
--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_equipmentHeroId_hero_id_fk" FOREIGN KEY ("equipmentHeroId") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;