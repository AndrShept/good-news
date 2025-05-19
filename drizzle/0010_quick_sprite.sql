ALTER TABLE "game_item" DROP CONSTRAINT "game_item_modifierId_modifier_id_fk";
--> statement-breakpoint
ALTER TABLE "game_item" ADD CONSTRAINT "game_item_modifierId_modifier_id_fk" FOREIGN KEY ("modifierId") REFERENCES "public"."modifier"("id") ON DELETE cascade ON UPDATE no action;