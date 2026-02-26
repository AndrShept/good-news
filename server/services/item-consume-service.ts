import { buffTemplateMapIds } from '@/shared/templates/buff-template';
import { HTTPException } from 'hono/http-exception';

import { buffInstanceService } from './buff-instance-service';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemInstanceService } from './item-instance-service';
import { itemTemplateService } from './item-template-service';

export const itemConsumeService = {
  drink(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const backpack = itemContainerService.getBackpack(hero.id);
    const findItemInstance = itemInstanceService.getItemInstance(backpack.id, itemInstanceId);
    const itemTemplateById = itemTemplateService.getAllItemsTemplateMapIds();
    const itemTemplate = itemTemplateById[findItemInstance.itemTemplateId];
    const isBuffPotion = itemTemplate.potionInfo?.type === 'BUFF';
    const isHealthPotion = !!(itemTemplate.potionInfo?.restore?.health ?? 0 > 0);
    const isManaPotion = !!(itemTemplate.potionInfo?.restore?.mana ?? 0 > 0);
    const isRestorePotion = isHealthPotion && isManaPotion;

    const isFullHealth = hero.currentHealth >= hero.maxHealth;
    const isFullMana = hero.currentMana >= hero.maxMana;
    if (isFullHealth && isHealthPotion && !isBuffPotion && !isRestorePotion) {
      throw new HTTPException(400, { message: 'You are already at full health', cause: { canShow: true } });
    }
    if (isFullHealth && isFullMana && !isBuffPotion && isRestorePotion) {
      throw new HTTPException(400, { message: 'You are already at full health and mana', cause: { canShow: true } });
    }
    if (isFullMana && isManaPotion && !isBuffPotion && !isRestorePotion) {
      throw new HTTPException(400, { message: 'You are already at full mana', cause: { canShow: true } });
    }

    const result = { name: '', message: '' };
    if (isBuffPotion) {
      const buffTemplate = buffTemplateMapIds[itemTemplate.potionInfo?.buffTemplateId ?? ''];
      buffInstanceService.createBuff(heroId, buffTemplate.id);
      result.message = 'You obtain new buff';
      result.name = buffTemplate.name;
    } else {
      hero.currentHealth = Math.min(hero.currentHealth + (itemTemplate.potionInfo?.restore?.health ?? 0), hero.maxHealth);
      hero.currentMana = Math.min(hero.currentMana + (itemTemplate.potionInfo?.restore?.mana ?? 0), hero.maxMana);
      result.message = 'You success use item ';
      result.name = itemTemplate.name;
    }
    const itemsDelta = itemContainerService.consumeItem({
      itemContainerId: backpack.id,
      itemInstanceId,
      quantity: 1,
      mode: 'use',
    });
    return { message: result.message, name: result.name, itemsDelta };
  },
  readSkillBook(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const backpack = itemContainerService.getBackpack(hero.id);
    const findItemInstance = itemInstanceService.getItemInstance(backpack.id, itemInstanceId);
    const itemTemplate = itemTemplateService.getAllItemsTemplateMapIds()[findItemInstance.itemTemplateId];
    const result = { name: '', message: '' };
    switch (itemTemplate.bookInfo?.kind) {
      case 'TRAIN_BUFF': {
        if (!itemTemplate.bookInfo.buffTemplateId) return 
        const buffTemplate = buffTemplateMapIds[itemTemplate.bookInfo.buffTemplateId];
        buffInstanceService.createBuff(heroId, itemTemplate.bookInfo.buffTemplateId);
        result.message = 'You obtain new buff';
        result.name = buffTemplate.name;
        break;
      }
    }

    const itemsDelta = itemContainerService.consumeItem({
      itemContainerId: backpack.id,
      itemInstanceId,
      quantity: 1,
      mode: 'use',
    });
    return { message: result.message, name: result.name, itemsDelta };
  },
};
