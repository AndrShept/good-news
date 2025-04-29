ALTER TABLE "hero" DROP CONSTRAINT "hero_modifierId_modifier_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_modifierId_modifier_id_fk" FOREIGN KEY ("modifierId") REFERENCES "public"."modifier"("id") ON DELETE no action ON UPDATE no action;