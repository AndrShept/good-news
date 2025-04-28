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
CREATE TABLE "hero" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"level" integer DEFAULT 1,
	"goldCoins" integer DEFAULT 100,
	"premiumCoins" integer DEFAULT 0,
	"isInBattle" boolean DEFAULT false,
	"isInDungeon" boolean DEFAULT false,
	"currentHealth" integer DEFAULT 100,
	"currentMana" integer DEFAULT 100,
	"maxHealth" integer DEFAULT 100,
	"maxMana" integer DEFAULT 100,
	"inventorySlotCount" integer DEFAULT 40,
	"inventorySlotMax" integer DEFAULT 40,
	"currentExperience" integer DEFAULT 0,
	"maxExperience" integer DEFAULT 100,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"modifierId" text,
	CONSTRAINT "hero_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "modifier" (
	"id" text PRIMARY KEY NOT NULL,
	"minDamage" integer DEFAULT 0,
	"maxDamage" integer DEFAULT 0,
	"strength" integer DEFAULT 10,
	"dexterity" integer DEFAULT 10,
	"intelligence" integer DEFAULT 10,
	"constitution" integer DEFAULT 10,
	"luck" integer DEFAULT 5,
	"manaRegeneration" integer DEFAULT 0,
	"healthRegeneration" integer DEFAULT 0,
	"armor" integer DEFAULT 0,
	"magicResistances" integer DEFAULT 0,
	"evasion" integer DEFAULT 0,
	"spellDamage" integer DEFAULT 0,
	"spellDamageCritPower" integer DEFAULT 0,
	"spellDamageCritChance" integer DEFAULT 0,
	"meleeDamage" integer DEFAULT 0,
	"meleeDamageCritPower" integer DEFAULT 0,
	"meleeDamageCritChance" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "comment_upvotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_upvotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"title" text NOT NULL,
	"url" text,
	"points" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"author_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_modifierId_modifier_id_fk" FOREIGN KEY ("modifierId") REFERENCES "public"."modifier"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_upvotes" ADD CONSTRAINT "comment_upvotes_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_upvotes" ADD CONSTRAINT "post_upvotes_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;