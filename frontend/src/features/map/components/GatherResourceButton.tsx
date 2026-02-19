import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useGatherResourceMutation } from '@/features/hero/hooks/useGatherResourceMutation';
import { gatheringConfig } from '@/shared/config/gathering-config';
import { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import { TileType } from '@/shared/types';

interface Props {
  disabled: boolean;
  tileType: Exclude<TileType, 'GROUND' | 'OBJECT'>;
}

export const GatherResourceButton = ({ disabled, tileType }: Props) => {
  const { mutate, isPending } = useGatherResourceMutation();

  return (
    <Button onClick={() => mutate({ skillKey: gatheringConfig[tileType].skillKey })} variant={'secondary'} disabled={disabled || isPending}>
      <GameIcon className="size-6" image={gatheringConfig[tileType].image} />
      <p className="truncate">{gatheringConfig[tileType].label}</p>
    </Button>
  );
};
