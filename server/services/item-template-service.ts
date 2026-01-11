import { armorTemplate } from '../data/armor-template';
import { potionTemplate } from '../data/potion-template';
import { resourceTemplate } from '../data/resource-template';
import { shieldTemplate } from '../data/shield-template';
import { weaponTemplate } from '../data/weapon-template';

export const ItemTemplateService = {
  getAllItemsTemplate() {
    const allItemsTemplate = [...armorTemplate, ...potionTemplate, ...resourceTemplate, ...weaponTemplate, ...shieldTemplate];
    return allItemsTemplate;
  },
};
