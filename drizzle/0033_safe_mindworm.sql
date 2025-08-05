ALTER TABLE "hero" DROP CONSTRAINT "hero_modifierId_modifier_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT "hero_actionId_action_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT "hero_locationId_location_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_modifierId_modifier_id_fk" FOREIGN KEY ("modifierId") REFERENCES "public"."modifier"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_actionId_action_id_fk" FOREIGN KEY ("actionId") REFERENCES "public"."action"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;