import type { GatheringCategorySkillKey } from '../templates/skill-template';
import type { TileType } from '../types';
import { imageConfig } from './image-config';

export const gatheringConfig: Record<
  Exclude<TileType, 'GROUND' | 'OBJECT'>,
  { label: string; image: string; skillKey: GatheringCategorySkillKey }
> = {
  WATER: { label: 'Fishing', image: imageConfig.icon.skill.FISHING, skillKey: 'FISHING' },
  ORE_VEIN: { label: 'Mine', image: imageConfig.icon.skill.MINING, skillKey: 'MINING' },
  ENHANCED_ORE_VEIN: { label: 'Mine', image: imageConfig.icon.skill.MINING, skillKey: 'MINING' },
  TREE_PATCH: { label: 'Lumber', image: imageConfig.icon.skill.LUMBERJACKING, skillKey: 'LUMBERJACKING' },
  ENHANCED_TREE_PATCH: { label: 'Lumber', image: imageConfig.icon.skill.LUMBERJACKING, skillKey: 'LUMBERJACKING' },
  HERB_PATCH: { label: 'Gather herbs', image: imageConfig.icon.skill.HERB_LORE, skillKey: 'HERBALISM' },
  ENHANCED_HERB_PATCH: { label: 'Gather herbs', image: imageConfig.icon.skill.HERB_LORE, skillKey: 'HERBALISM' },
};
