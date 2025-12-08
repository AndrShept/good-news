import { BASE_HEALTH_REGEN_TIME, BASE_MANA_REGEN_TIME, BASE_WALK_TIME, HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT } from './constants';

export const calculate = {
  walkTime(dexterity: number) {
    const MIN_WALK_TIME = 2;
    const dexterityFactor = 100;

    const delay = Math.max(BASE_WALK_TIME / (1 + dexterity / dexterityFactor), MIN_WALK_TIME);
    return delay;
  },
  maxValues(data: { constitution: number; intelligence: number; bonusMaxHealth: number; bonusMaxMana: number }) {
    const { constitution, intelligence, bonusMaxHealth, bonusMaxMana } = data;
    const maxHealth = constitution * HP_MULTIPLIER_COST + bonusMaxHealth;
    const maxMana = intelligence * MANA_MULTIPLIER_INT + bonusMaxMana;

    return { maxHealth, maxMana };
  },

  healthRegenTime(constitution: number) {
    const time = BASE_HEALTH_REGEN_TIME - constitution * 20;
    return Math.max(1000, time);
  },
  manaRegenTime(intelligence: number) {
    const time = BASE_MANA_REGEN_TIME - intelligence * 30;
    return Math.max(1000, time);
  },

  getExpSkillToNextLevel(skillLevel: number, difficultyMultiplier: number) {
    return Math.floor(100 * Math.pow(skillLevel, difficultyMultiplier));
  },

  getCraftSkillXp(skillLevel: number, difficultyMultiplier: number, rarityBaseXp: number) {
    // Чим більший skillLevel — тим повільніша прокачка
    const difficultyScale = Math.pow(skillLevel, difficultyMultiplier);

    // Фінальний XP за крафт
    const xp = rarityBaseXp / (1 + difficultyScale / 50);

    return Math.floor(xp);
  },
};
