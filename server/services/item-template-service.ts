import type { ItemTemplate } from '@/shared/types';

import { armorTemplate } from '../data/armor-template';
import { potionTemplate } from '../data/potion-template';
import { resourceTemplate } from '../data/resource-template';
import { shieldTemplate } from '../data/shield-template';
import { weaponTemplate } from '../data/weapon-template';
import { buffTemplate } from '../data/buff-template';

export const ItemTemplateService = {
  getAllItemsTemplate() {
    const allItemsTemplate = [...armorTemplate, ...potionTemplate, ...resourceTemplate, ...weaponTemplate, ...shieldTemplate];
    return allItemsTemplate;
  },

  getAllItemsTemplateMapIds() {
    const allItemsTemplate = this.getAllItemsTemplate();

    const mapIds = allItemsTemplate.reduce(
      (acc, template) => {
        acc[template.id] = template;
        return acc;
      },
      {} as Record<string, ItemTemplate>,
    );
    return mapIds;
  },
};
