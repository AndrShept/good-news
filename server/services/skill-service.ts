import { type LoreSkillKey, type SkillKey, skillTemplateById, skillTemplateByKey } from '@/shared/templates/skill-template';
import type { RecipeTemplate, ResourceCategoryType, SkillInstance } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { skillExpConfig } from '../lib/config/skill-exp-config';
import { itemTemplateService } from './item-template-service';
import { deltaEventsService } from './delta-events-service';

export const skillService = {
  getSkillBySkillTemplateId(heroId: string, skillTemplateId: string) {
    const skills = serverState.skill.get(heroId);
    const skill = skills?.find((s) => s.skillTemplateId === skillTemplateId);
    if (!skill) throw new HTTPException(404, { message: 'skill not found!' });
    return skill;
  },
  getSkillByInstanceId(heroId: string, instanceSkillId: string) {
    const skills = serverState.skill.get(heroId);
    const skill = skills?.find((s) => s.id === instanceSkillId);
    if (!skill) throw new HTTPException(404, { message: 'skill not found!' });
    return skill;
  },
  getSkillByKey(heroId: string, key: SkillKey) {
    const skillTemplate = skillTemplateByKey[key];
    const skills = serverState.skill.get(heroId);
    const skill = skills?.find((s) => s.skillTemplateId === skillTemplate.id);
    if (!skill) throw new HTTPException(404, { message: 'skill not found!' });
    return skill;
  },

  getExpSkillToNextLevel(skillKey: SkillKey, skillLevel: number) {
    const baseExp = 10;
    const growth = 1.08; // наскільки EXP росте з кожним 0.1 рівнем
    const multiplier = skillExpConfig[skillKey].difficultyMultiplier;

    // skillLevel може бути float (0.0, 0.1, 0.2 ...)
    return Math.floor(baseExp * Math.pow(skillLevel + 1, growth * multiplier));
  },

  addExp(heroId: string, skillKey: SkillKey, amount: number) {
    const skill = this.getSkillByKey(heroId, skillKey);
    const skillTemplate = skillTemplateByKey[skillKey];
    let expToLevel = this.getExpSkillToNextLevel(skillKey, skill.level);
    skill.currentExperience += amount;

    const result = {
      message: `Your gain skill ${skillTemplate.name}`,
      isLevelUp: false,
      amount,
      skillInstanceId: skill.id,
    };
    let increment = 0;
    while (skill.currentExperience >= expToLevel) {
      skill.level += 0.1;
      increment += 0.1;
      skill.currentExperience -= expToLevel;
      expToLevel = this.getExpSkillToNextLevel(skillKey, skill.level);
      skill.expToLvl = expToLevel;
      result.message = `Your skill in ${skillTemplate.name} has increased by ${increment}. It is now ${skill.level.toFixed(1)}  🔥`;
      result.isLevelUp = true;
    }
    deltaEventsService.skillInstance.update(skill.id , {
      currentExperience: 
      skill.currentExperience,
      level: skill.level,
      expToLvl: skill.expToLvl
    })
    return result;
  },

  checkSkillRequirement(heroId: string, skillTemplateId: string, level: number) {
    const skill = this.getSkillBySkillTemplateId(heroId, skillTemplateId);
    const template = skillTemplateById[skill.skillTemplateId];

    if (skill.level < level)
      throw new HTTPException(409, { message: `Your ${template.name} skill level is too low.`, cause: { canShow: true } });
  },
  getLoreSkillKey(recipe: RecipeTemplate, coreResourceId: string | undefined) {
    const loreSkillByResourceCategory: Record<ResourceCategoryType, LoreSkillKey> = {
      INGOT: 'INGOT_LORE',
      LEATHER: 'LEATHER_LORE',
      CLOTH: 'CLOTH_LORE',
      ORE: 'ORE_LORE',
      WOOD: 'WOOD_LORE',
      HERB: 'HERB_LORE',
    };

    if (coreResourceId) {
      const template = itemTemplateService.getAllItemsTemplateMapIds()[coreResourceId];
      if (!template.resourceInfo?.category) throw new Error('getLoreSkillResource template.resourceInfo?.category not found ');

      return loreSkillByResourceCategory[template.resourceInfo.category];
    }

    return loreSkillByResourceCategory[recipe.requirement.category];
  },
  getLoreSkillByItemTemplateId(itemTemplateId: string) {
    const template = itemTemplateService.getAllItemsTemplateMapIds()[itemTemplateId];
    if (!template.resourceInfo) return;
    const loreSkillByResourceCategory: Record<ResourceCategoryType, LoreSkillKey> = {
      INGOT: 'INGOT_LORE',
      LEATHER: 'LEATHER_LORE',
      CLOTH: 'CLOTH_LORE',
      ORE: 'ORE_LORE',
      WOOD: 'WOOD_LORE',
      HERB: 'HERB_LORE',
    };

    return loreSkillByResourceCategory[template.resourceInfo.category];
  },
};
