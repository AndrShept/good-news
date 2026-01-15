import { and, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { calculate } from '../lib/calculate';

export const skillService = () => ({
  async getSkills() {},

  async setCurrentExp() {},

  async checkSkillRequirement() {},
});
