CREATE TYPE "public"."state_type_enum" AS ENUM('IDLE', 'CHARACTER', 'SKILLS');--> statement-breakpoint
CREATE TABLE "state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "state_type_enum" NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT "hero_modifierId_modifier_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT "hero_actionId_action_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT "hero_locationId_location_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "stateId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_stateId_state_id_fk" FOREIGN KEY ("stateId") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_modifierId_modifier_id_fk" FOREIGN KEY ("modifierId") REFERENCES "public"."modifier"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_actionId_action_id_fk" FOREIGN KEY ("actionId") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;