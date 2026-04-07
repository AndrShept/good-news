import type { RefiningRecipe } from '@/shared/types';

export const refiningRecipes = [
  //-------- ORE => INGOT --------//
  // Масовий => 3:1, час менший
  { input: 'IRON_ORE', inputQuantity: 3, output: 'IRON_INGOT', outputQuantity: 1, requiredMinSkill: 0, refiningTimeMs: 60_000 }, // 1 хв
  { input: 'COPPER_ORE', inputQuantity: 3, output: 'COPPER_INGOT', outputQuantity: 1, requiredMinSkill: 20, refiningTimeMs: 75_000 },
  { input: 'SILVER_ORE', inputQuantity: 2, output: 'SILVER_INGOT', outputQuantity: 1, requiredMinSkill: 30, refiningTimeMs: 90_000 },
  { input: 'GOLD_ORE', inputQuantity: 2, output: 'GOLD_INGOT', outputQuantity: 1, requiredMinSkill: 40, refiningTimeMs: 120_000 }, // 2 хв
  // Рідкісний => 1:1, час більший
  { input: 'MITHRIL_ORE', inputQuantity: 1, output: 'MITHRIL_INGOT', outputQuantity: 1, requiredMinSkill: 60, refiningTimeMs: 150_000 }, // 2.5 хв
  {
    input: 'ADAMANTINE_ORE',
    inputQuantity: 1,
    output: 'ADAMANTINE_INGOT',
    outputQuantity: 1,
    requiredMinSkill: 80,
    refiningTimeMs: 180_000,
  }, // 3 хв

  //-------- LOG => PLANK --------//
  // Дерево дає більше планок з одного лога
  { input: 'REGULAR_LOG', inputQuantity: 1, output: 'REGULAR_PLANK', outputQuantity: 3, requiredMinSkill: 0, refiningTimeMs: 45_000 },
  { input: 'PINE_LOG', inputQuantity: 1, output: 'PINE_PLANK', outputQuantity: 3, requiredMinSkill: 10, refiningTimeMs: 50_000 },
  { input: 'OAK_LOG', inputQuantity: 1, output: 'OAK_PLANK', outputQuantity: 3, requiredMinSkill: 20, refiningTimeMs: 60_000 },
  { input: 'ASH_LOG', inputQuantity: 1, output: 'ASH_PLANK', outputQuantity: 2, requiredMinSkill: 30, refiningTimeMs: 75_000 },
  { input: 'YEW_LOG', inputQuantity: 1, output: 'YEW_PLANK', outputQuantity: 2, requiredMinSkill: 50, refiningTimeMs: 90_000 },
  { input: 'MAHOGANY_LOG', inputQuantity: 1, output: 'MAHOGANY_PLANK', outputQuantity: 2, requiredMinSkill: 60, refiningTimeMs: 105_000 },
  { input: 'EBONY_LOG', inputQuantity: 1, output: 'EBONY_PLANK', outputQuantity: 2, requiredMinSkill: 70, refiningTimeMs: 120_000 },
  { input: 'BLOOD_LOG', inputQuantity: 1, output: 'BLOOD_PLANK', outputQuantity: 1, requiredMinSkill: 85, refiningTimeMs: 150_000 },
  { input: 'GHOST_LOG', inputQuantity: 1, output: 'GHOST_PLANK', outputQuantity: 1, requiredMinSkill: 95, refiningTimeMs: 180_000 },

  //-------- HIDE => LEATHER --------//
  { input: 'REGULAR_HIDE', inputQuantity: 1, output: 'REGULAR_LEATHER', outputQuantity: 1, requiredMinSkill: 0, refiningTimeMs: 60_000 },
  { input: 'ROUGH_HIDE', inputQuantity: 1, output: 'ROUGH_LEATHER', outputQuantity: 1, requiredMinSkill: 15, refiningTimeMs: 75_000 },
  { input: 'REPTILE_HIDE', inputQuantity: 1, output: 'REPTILE_LEATHER', outputQuantity: 1, requiredMinSkill: 30, refiningTimeMs: 90_000 },
  { input: 'IRON_HIDE', inputQuantity: 1, output: 'IRON_LEATHER', outputQuantity: 1, requiredMinSkill: 50, refiningTimeMs: 120_000 },
  { input: 'DEMON_HIDE', inputQuantity: 1, output: 'DEMON_LEATHER', outputQuantity: 1, requiredMinSkill: 70, refiningTimeMs: 150_000 },
  { input: 'DRAGON_HIDE', inputQuantity: 1, output: 'DRAGON_LEATHER', outputQuantity: 1, requiredMinSkill: 90, refiningTimeMs: 180_000 },

  //-------- FUR => CURED FUR --------//
  { input: 'REGULAR_FUR', inputQuantity: 2, output: 'REGULAR_CURED_FUR', outputQuantity: 1, requiredMinSkill: 0, refiningTimeMs: 60_000 },
  { input: 'THICK_FUR', inputQuantity: 2, output: 'THICK_CURED_FUR', outputQuantity: 1, requiredMinSkill: 20, refiningTimeMs: 75_000 },
  { input: 'DARK_FUR', inputQuantity: 2, output: 'DARK_CURED_FUR', outputQuantity: 1, requiredMinSkill: 40, refiningTimeMs: 90_000 },
  { input: 'SHADOW_FUR', inputQuantity: 2, output: 'SHADOW_CURED_FUR', outputQuantity: 1, requiredMinSkill: 60, refiningTimeMs: 120_000 },
  { input: 'SNOW_FUR', inputQuantity: 2, output: 'SNOW_CURED_FUR', outputQuantity: 1, requiredMinSkill: 80, refiningTimeMs: 150_000 },

  //-------- FIBER => CLOTH --------//
  { input: 'FLAX', inputQuantity: 3, output: 'REGULAR_CLOTH', outputQuantity: 1, requiredMinSkill: 0, refiningTimeMs: 60_000 },
  { input: 'COTTON', inputQuantity: 5, output: 'REGULAR_CLOTH', outputQuantity: 1, requiredMinSkill: 10, refiningTimeMs: 75_000 },
] as const satisfies RefiningRecipe[];

export const refiningRecipeByInput = Object.fromEntries(refiningRecipes.map((r) => [r.input, r])) as Record<string, RefiningRecipe>;
export const refiningRecipeByOutput = Object.fromEntries(refiningRecipes.map((r) => [r.output, r])) as Record<string, RefiningRecipe>;
