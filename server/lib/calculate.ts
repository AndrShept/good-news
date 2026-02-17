import {
  BASE_HEALTH_REGEN_TIME,
  BASE_MANA_REGEN_TIME,
  BASE_WALK_TIME,
  HP_MULTIPLIER_COST,
  MANA_MULTIPLIER_INT,
} from '../../shared/constants';

export const calculate = {
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
