import { type SkillKey, skillTemplateById, skillTemplateByKey } from '@/shared/templates/skill-template';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { skillExpConfig } from '../lib/config/skill-exp-config';

export const skillService = {
  getSkillById(heroId: string, skillTemplateId: string) {
    const skills = serverState.skill.get(heroId);
    const skill = skills?.find((s) => s.skillTemplateId === skillTemplateId);
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
    return Math.floor(100 * Math.pow(skillLevel, skillExpConfig[skillKey].difficultyMultiplier));
  },

  setSkillExp(heroId: string, skillKey: SkillKey, amount: number) {
    const skill = this.getSkillByKey(heroId, skillKey);
    const expToLevel = this.getExpSkillToNextLevel(skillKey, skill.level);
    skill.currentExperience += amount;

    const result = {
      message: `Your gain skill ${skillKey.toLowerCase()}`,
      isLevelUp: false,
      amount,
      skillInstanceId: skill.id,
    };

    if (skill.currentExperience >= expToLevel) {
      skill.level++;
      skill.currentExperience = 0;
      skill.expToLvl = this.getExpSkillToNextLevel(skillKey, skill.level);
      result.message = `Congratulation! your  skill ${skillKey.toLowerCase()} up to level ${skill.level} 🔥`;
      result.isLevelUp = true;
    }

    return result;
  },

  checkSkillRequirement(heroId: string, skillId: string, level: number) {
    const skill = this.getSkillById(heroId, skillId);
    const template = skillTemplateById[skill.skillTemplateId];

    if (skill.level < level)
      throw new HTTPException(409, { message: `Your ${template.name} skill level is too low.`, cause: { canShow: true } });
  },
};
