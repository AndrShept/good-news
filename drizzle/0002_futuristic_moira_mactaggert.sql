CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"age" integer,
	"image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"depth" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"parent_comment_id" integer,
	"author_id" text NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "goldCoins" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "premiumCoins" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "isInBattle" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "isInDungeon" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "currentHealth" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "currentMana" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "maxHealth" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "maxMana" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "inventorySlotCount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "inventorySlotMax" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "currentExperience" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "maxExperience" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "minDamage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "maxDamage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "strength" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "strength" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "dexterity" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "dexterity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "intelligence" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "intelligence" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "constitution" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "constitution" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "luck" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "luck" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "manaRegeneration" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "healthRegeneration" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "armor" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "magicResistances" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "evasion" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "spellDamage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "spellDamageCritPower" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "spellDamageCritChance" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "meleeDamage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "meleeDamageCritPower" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "meleeDamageCritChance" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "currentStatPoints" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "freeStatPoints" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;