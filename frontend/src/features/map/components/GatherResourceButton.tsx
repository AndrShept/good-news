import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useGatherResourceMutation } from '@/features/hero/hooks/useGatherResourceMutation';
import { imageConfig } from '@/shared/config/image-config';
import { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import { TileType } from '@/shared/types';

interface Props {
  disabled: boolean;
  tileType: Exclude<TileType, 'GROUND' | 'OBJECT'>;
}

export const GatherResourceButton = ({ disabled, tileType }: Props) => {
  const { mutate, isPending } = useGatherResourceMutation();
  const gatheringButtonConfig: Record<
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
  return (
    <Button
      onClick={() => mutate({ skillKey: gatheringButtonConfig[tileType].skillKey })}
      variant={'secondary'}
      disabled={disabled || isPending}
    >
      <GameIcon className="size-6" image={gatheringButtonConfig[tileType].image} />
      <p className="truncate">{gatheringButtonConfig[tileType].label}</p>
    </Button>
  );
};
