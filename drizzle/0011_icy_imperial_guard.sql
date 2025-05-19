ALTER TABLE "hero" RENAME COLUMN "inventorySlotCount" TO "currentInventorySlots";--> statement-breakpoint
ALTER TABLE "hero" RENAME COLUMN "inventorySlotMax" TO "maxInventorySlots";--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "isOnline" boolean DEFAULT true NOT NULL;