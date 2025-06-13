CREATE TYPE "public"."buff_type_enum" AS ENUM('SPELL', 'POTION');--> statement-breakpoint
CREATE TABLE "buff" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"duration" integer DEFAULT 0 NOT NULL,
	"type" "buff_type_enum" NOT NULL,
	"heroId" text NOT NULL,
	"modifierId" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "buff" ADD CONSTRAINT "buff_heroId_hero_id_fk" FOREIGN KEY ("heroId") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buff" ADD CONSTRAINT "buff_modifierId_modifier_id_fk" FOREIGN KEY ("modifierId") REFERENCES "public"."modifier"("id") ON DELETE cascade ON UPDATE no action;