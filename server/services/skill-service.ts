import { calculate } from '@/shared/calculate';
import type { CraftItemRequiredSkills, RarityType, ResourceType, Skill, SkillType } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { skillTable } from '../db/schema';

export const skillService = (db: TTransaction | TDataBase) => ({
  async getSkills(heroId: string) {
    const skills = await db.query.skillTable.findMany({ where: eq(skillTable.heroId, heroId) });

    return skills;
  },
  async getSkill(heroId: string, skillType: SkillType) {
    const skill = await db.query.skillTable.findFirst({ where: and(eq(skillTable.heroId, heroId), eq(skillTable.type, skillType)) });

    if (!skill) {
      throw new HTTPException(404, { message: 'skill not found' });
    }
    return skill;
  },

  async setCurrentExp(skillType: SkillType, skillLevel: number, heroId: string, expQuantity: number) {
    const result = {
      isLevelUp: false,
      message: '',
    };
    let level = 0;
    const [newExpQuantity] = await db
      .update(skillTable)
      .set({
        currentExperience: sql`${skillTable.currentExperience} + ${expQuantity}`,
      })
      .where(and(eq(skillTable.type, skillType), eq(skillTable.heroId, heroId)))
      .returning({ currentExperience: skillTable.currentExperience });
    const nextLevelExp = calculate.getExpSkillToNextLevel(skillType, skillLevel);
    result.message = `You gained ${expQuantity} crafting EXP.`;

    if (newExpQuantity.currentExperience >= nextLevelExp) {
      const [returningLevel] = await db
        .update(skillTable)
        .set({
          level: sql`${skillTable.level} + 1`,
          currentExperience: 0,
        })
        .where(and(eq(skillTable.type, skillType), eq(skillTable.heroId, heroId)))
        .returning({ level: skillTable.level });
      level = returningLevel.level;
      result.isLevelUp = true;
      result.message = `Congratulation !!! Your skill ${skillType.toLowerCase()} gain to level ${level}`;
    }
    return result;
  },

  async checkSkillRequirement(heroId: string, craftItemSkillReq: CraftItemRequiredSkills[] | undefined) {
    if (!craftItemSkillReq?.length) {
      console.error('fn checkSkillRequirement ,craftItemSkillReq?.length === 0 ');
      return;
    }
    for (const skill of craftItemSkillReq) {
      const findSkill = await this.getSkill(heroId, skill.type);
      if (findSkill.level < skill.level) {
        throw new HTTPException(409, {
          message: `Your ${skill.type.toLowerCase()} skill is too low. You need at least level ${skill.level}. `,
          cause: { canShow: true },
        });
      }
    }
  },
});
