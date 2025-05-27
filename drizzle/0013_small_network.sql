ALTER TABLE "hero" ALTER COLUMN "currentInventorySlots" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "game_item" ADD COLUMN "weaponHand" "weapon_hand_enum";