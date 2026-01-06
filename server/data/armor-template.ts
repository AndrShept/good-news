import type { itemTemplateTable } from '../db/schema/item-template-schema';

export const armorTemplate = [
  {
    id: 'e0785970-3c64-4187-b00b-13e3c3f34f55',
    name: 'plate armor',
    image: '/sprites/equipments/breastplates/Icon1.jpg',
    type: 'ARMOR',
    stackable: false,
    equipInfo: {
      armorType: 'CHEST',
      armorCategory: 'PLATE',
    },
    coreModifier: {
      defense: 20,
      evasion: -30,
    },
  },

] as const satisfies (typeof itemTemplateTable.$inferInsert)[];
