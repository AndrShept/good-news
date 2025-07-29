ALTER TABLE "hero" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "modifierId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hero" ALTER COLUMN "groupId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "modifier" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "equipment" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "equipment" ALTER COLUMN "equipmentHeroId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "equipment" ALTER COLUMN "gameItemId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "game_item" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "game_item" ALTER COLUMN "modifierId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "inventory_item" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "inventory_item" ALTER COLUMN "gameItemId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "inventory_item" ALTER COLUMN "inventoryHeroId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "buff" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "buff" ALTER COLUMN "heroId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "buff" ALTER COLUMN "modifierId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "id" SET DATA TYPE uuid;