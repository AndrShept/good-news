import { calculate } from '@/shared/calculate';
import type { RarityType, ResourceType, SkillType } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { rarityXpRewards, skillExpConfig } from '../config/skill-exp-config';
import type { TDataBase, TTransaction } from '../db/db';
import { skillTable } from '../db/schema';

export const skillService = (db: TTransaction | TDataBase) => ({
  async getSkills(heroId: string) {
    const skills = await db.query.skillTable.findMany({ where: eq(skillTable.heroId, heroId) });

    return skills;
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
      result.message = `Your skill ${skillType.toLowerCase()} gain to level ${level}`;
    }

    return result;
  },
});
