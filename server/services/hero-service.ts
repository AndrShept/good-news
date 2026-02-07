import { HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT } from '@/shared/constants';
import { buffTemplateMapIds } from '@/shared/templates/buff-template';
import type { Hero, OmitModifier } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { calculate } from '../lib/calculate';
import { getModifierByResourceKey, sumAllModifier } from '../lib/utils';
import { itemContainerService } from './item-container-service';
import { itemTemplateService } from './item-template-service';

export const heroService = {
  getHero(heroId: string) {
    const hero = serverState.hero.get(heroId);
    if (!hero) throw new HTTPException(404, { message: 'hero not found' });
    return hero;
  },

  checkFreeBackpackCapacity(heroId: string, value?: number) {
    const backpack = itemContainerService.getBackpack(heroId);

    if (backpack.capacity < backpack.itemsInstance.length + (value ?? 0)) {
      throw new HTTPException(409, { message: 'Backpack is full!', cause: { canShow: true } });
    }
  },

  assertHasEnoughGold(heroId: string, amount: number) {
    const hero = this.getHero(heroId);

    if (hero.goldCoins < amount) {
      throw new HTTPException(409, {
        message: 'Not enough gold',
        cause: { canShow: true },
      });
    }
  },

  getHeroStatsWithModifiers(heroId: string) {
    const hero = this.getHero(heroId);
    const buffs = serverState.buff.get(heroId) ?? [];

    const itemsMapIds = itemTemplateService.getAllItemsTemplateMapIds();
    const modifiers = [
      ...buffs.map((b) => buffTemplateMapIds[b.buffTemplateId].modifier),
      ...(hero.equipments ?? []).map((e) => itemsMapIds[e.itemTemplateId].coreModifier),
      ...(hero.equipments ?? []).map((e) => e.coreResourceModifier),
    ];

    const sumModifier = sumAllModifier(...modifiers);
    const sumStatAndModifier = sumAllModifier(sumModifier, hero?.stat);

    return {
      sumModifier,
      sumStatAndModifier,
    };
  },
  calculateMaxValues(data: { constitution: number; wisdom: number; bonusMaxHealth: number; bonusMaxMana: number }) {
    const { constitution, wisdom, bonusMaxHealth, bonusMaxMana } = data;
    const maxHealth = constitution * HP_MULTIPLIER_COST + bonusMaxHealth;
    const maxMana = wisdom * MANA_MULTIPLIER_INT + bonusMaxMana;

    return { maxHealth, maxMana };
  },

  updateModifier(heroId: string) {
    const hero = this.getHero(heroId);
    const { sumModifier, sumStatAndModifier } = this.getHeroStatsWithModifiers(heroId);
    const { maxHealth, maxMana } = this.calculateMaxValues({
      bonusMaxHealth: sumStatAndModifier.maxHealth,
      bonusMaxMana: sumStatAndModifier.maxMana,
      constitution: sumStatAndModifier.constitution,
      wisdom: sumStatAndModifier.wisdom,
    });
    hero.maxHealth = maxHealth;
    hero.maxMana = maxMana;
    hero.currentHealth = Math.min(maxHealth, hero.currentHealth);
    hero.currentMana = Math.min(maxMana, hero.currentMana);
    hero.modifier = { ...hero.modifier, ...sumModifier };

    const healthTimeMs = calculate.healthRegenTime(sumStatAndModifier.constitution);
    const manaTimeMs = calculate.manaRegenTime(sumStatAndModifier.wisdom);
    hero.regen.manaTimeMs = manaTimeMs;
    hero.regen.healthTimeMs = healthTimeMs;
  },
  updateRegenTime(heroId: string) {
    const hero = this.getHero(heroId);
    const { sumModifier, sumStatAndModifier } = this.getHeroStatsWithModifiers(heroId);
    const healthTimeMs = calculate.manaRegenTime(sumStatAndModifier.constitution);
    const manaTimeMs = calculate.manaRegenTime(sumStatAndModifier.wisdom);
    hero.regen.manaTimeMs = manaTimeMs;
    hero.regen.healthTimeMs = healthTimeMs;
  },
  spendGold(heroId: string, amount: number) {
    const hero = this.getHero(heroId);
    if (hero.goldCoins < amount) throw new HTTPException(422, { message: 'You don’t have enough gold', cause: { canShow: true } });

    hero.goldCoins -= amount;
  },
  spendPremCoin(heroId: string, amount: number) {
    const hero = this.getHero(heroId);
    if (hero.premiumCoins < amount)
      throw new HTTPException(422, { message: 'You don’t have enough premium coin', cause: { canShow: true } });

    hero.premiumCoins -= amount;
  },
};
