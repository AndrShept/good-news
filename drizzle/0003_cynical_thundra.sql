ALTER TABLE "hero" ALTER COLUMN "freeStatPoints" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "strength" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "dexterity" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "intelligence" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "constitution" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "luck" SET DEFAULT 5;--> statement-breakpoint
ALTER TABLE "hero" DROP COLUMN "currentStatPoints";