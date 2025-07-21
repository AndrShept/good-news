CREATE TABLE "group" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "hero" DROP CONSTRAINT "hero_groupId_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;