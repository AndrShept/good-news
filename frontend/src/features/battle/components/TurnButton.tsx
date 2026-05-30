import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { SelectedAttackingZone, SelectedDefenseZone } from '@/shared/types';

import { useParticipantTurnMutation } from '../hooks/useParticipantTurnMutation';

interface Props {
  selectedAttackingZone: SelectedAttackingZone;

  selectedDefenseZone: SelectedDefenseZone;
  targetId: string;
}
export const TurnButton = ({ selectedAttackingZone, selectedDefenseZone, targetId }: Props) => {
  const { mutate, isPending } = useParticipantTurnMutation();
  const heroId = useHeroId();
  return (
    <Button
      className="w-1/2"
      disabled={isPending}
      onClick={() => {
        mutate({ attackingZone: selectedAttackingZone, defenseZone: selectedDefenseZone, heroId, targetId });
      }}
    >
      Turn
    </Button>
  );
};
