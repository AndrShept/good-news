import { HTTPException } from 'hono/http-exception';

export const itemUseService = {
  drink() {
    const isBuffPotion = findItem.itemTemplate.potionInfo?.type === 'BUFF';
    const isHealthPotion = !!(findItem.itemTemplate.potionInfo?.restore?.health ?? 0 > 0);
    const isManaPotion = !!(findItem.itemTemplate.potionInfo?.restore?.mana ?? 0 > 0);
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
  },

   
};
