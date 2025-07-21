ALTER TABLE "hero" DROP CONSTRAINT "hero_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;