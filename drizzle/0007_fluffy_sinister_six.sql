ALTER TABLE "hero" RENAME COLUMN "image" TO "avatarImage";--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "characterImage" text NOT NULL;