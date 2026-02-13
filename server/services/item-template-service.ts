import { armorTemplate } from '@/shared/templates/armor-template';
import { potionTemplate } from '@/shared/templates/potion-template';
import { resourceTemplate } from '@/shared/templates/resource-template';
import { shieldTemplate } from '@/shared/templates/shield-template';
import { skillBooks } from '@/shared/templates/skill-book-template';
import { toolsTemplate } from '@/shared/templates/tool-template';
import { weaponTemplate } from '@/shared/templates/weapon-template';
import type { ItemTemplate } from '@/shared/types';

export const itemTemplateService = {
  getAllItemsTemplate() {
    const allItemsTemplate = [
      ...armorTemplate,
      ...potionTemplate,
      ...resourceTemplate,
      ...weaponTemplate,
      ...shieldTemplate,
      ...skillBooks,
      ...toolsTemplate,
    ];
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
