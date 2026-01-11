import { HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT } from '@/shared/constants';
import type { Hero, OmitModifier } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { sumAllModifier } from '../lib/utils';

export const heroService = {
  getHero(heroId: string) {
    const hero = serverState.hero.get(heroId);
    if (!hero) throw new HTTPException(404, { message: 'hero not found' });
    return hero;
  },

  getHeroStatsWithModifiers(heroId: string) {
    const hero = this.getHero(heroId);
    const coreMaterialModifiers: Partial<OmitModifier>[] = [];
    // for (const item of equipments) {
    //   const coreMaterialModifier = craftItemService(db).getMaterialModifier(item.gameItem, item.gameItem.coreMaterial);
    //   if (coreMaterialModifier) {
    //     coreMaterialModifiers.push(coreMaterialModifier);
    //   }
    // }

    const modifiers = [
      ...hero.buffs.map((b) => b.buffTemplate?.modifier),
      ...(hero.equipments ?? []).map((e) => e.itemTemplate?.coreModifier),
      ...coreMaterialModifiers,
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

  async updateModifier(heroId: string) {
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
    hero.modifier = { ...hero.modifier, ...sumModifier };
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
