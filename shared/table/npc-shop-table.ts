import { potionTemplateByKey } from '../templates/potion-template';
import { resourceTemplateByKey } from '../templates/resource-template';
import { toolTemplateByKey } from '../templates/tool-template';
import type { NPCShopTable } from '../types';

// npc-shop-table.ts
export const NPC_SHOP_TABLE: Record<string, NPCShopTable> = {
  '019d78f1-609a-7d97-af2b-9155d9359256': {
    // Vex Alchemist
    sells: [
      { itemTemplateId: potionTemplateByKey.small_health_potion.id, price: 50 },
      { itemTemplateId: potionTemplateByKey.small_mana_potion.id, price: 60 },
      { itemTemplateId: resourceTemplateByKey.REDCAP_MUSHROOM.id, price: 20 },
    ],
    buys: [
      { itemTemplateId: resourceTemplateByKey.GREENLEAF.id, price: 5 },
      { itemTemplateId: resourceTemplateByKey.REDCAP_MUSHROOM.id, price: 8 },
      { itemTemplateId: resourceTemplateByKey.ROSE.id, price: 6 },
    ],
  },
  '019d78f3-17a4-7b42-a1cf-cabf8b8601fa': {
    // Brom Tinker
    sells: [
      { itemTemplateId: toolTemplateByKey.Mining_Pickaxe.id, price: 120 },
      { itemTemplateId: toolTemplateByKey.Fishing_Rod.id, price: 100 },
      { itemTemplateId: toolTemplateByKey.Fishing_Rod.id, price: 80 },
    ],
    buys: [],
  },
};
