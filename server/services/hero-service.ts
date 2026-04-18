import { buffTemplateMapIds } from '@/shared/templates/buff-template';
import type { MapHero } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { BASE_HEALTH_REGEN_TIME, BASE_MANA_REGEN_TIME, BASE_WALK_TIME, HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT } from '../lib/config/server-constants';
import { sumAllModifier } from '../lib/utils';
import { itemContainerService } from './item-container-service';
import { itemTemplateService } from './item-template-service';

export const heroService = {
  getHero(heroId: string) {
    const hero = serverState.hero.get(heroId);
    if (!hero) throw new HTTPException(404, { message: 'hero not found' });
    return hero;
  },

  getHeroMapData(heroId: string): MapHero {
    const hero = this.getHero(heroId);
    return {
      id: hero.id,
      avatarImage: hero.avatarImage,
      characterImage: hero.characterImage,
      level: hero.level,
      name: hero.name,
      state: hero.state,
      x: hero.location.x,
      y: hero.location.y,
    };
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

    // const itemsMapIds = itemTemplateService.getAllItemsTemplateMapIds();
    const modifiers = [
      ...buffs.map((b) => buffTemplateMapIds[b.buffTemplateId].modifier),
      // ...(hero.equipments ?? []).map((e) => itemsMapIds[e.itemTemplateId].modifier),
      ...(hero.equipments ?? []).map((e) => e.modifier),
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

    const healthTimeMs = this.healthRegenTime(sumStatAndModifier.constitution);
    const manaTimeMs = this.manaRegenTime(sumStatAndModifier.wisdom);
    hero.regen.manaTimeMs = manaTimeMs;
    hero.regen.healthTimeMs = healthTimeMs;
  },
  updateRegenTime(heroId: string) {
    const hero = this.getHero(heroId);
    const { sumModifier, sumStatAndModifier } = this.getHeroStatsWithModifiers(heroId);
    const healthTimeMs = this.manaRegenTime(sumStatAndModifier.constitution);
    const manaTimeMs = this.manaRegenTime(sumStatAndModifier.wisdom);
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
  walkTime(dexterity: number) {
    const MIN_WALK_TIME = 2;
    const dexterityFactor = 100;

    const delay = Math.max(BASE_WALK_TIME / (1 + dexterity / dexterityFactor), MIN_WALK_TIME);
    return delay;
  },

  healthRegenTime(constitution: number) {
    const time = BASE_HEALTH_REGEN_TIME - constitution * 20;
    return Math.max(1000, time);
  },
  manaRegenTime(wisdom: number) {
    const time = BASE_MANA_REGEN_TIME - wisdom * 30;
    return Math.max(1000, time);
  },
};
