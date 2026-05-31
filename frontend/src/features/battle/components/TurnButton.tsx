import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { SelectedAttackingZone, SelectedDefenseZone } from '@/shared/types';
import { useState } from 'react';

import { useParticipantTurnMutation } from '../hooks/useParticipantTurnMutation';

interface Props {
  selectedAttackingZone: SelectedAttackingZone;

  selectedDefenseZone: SelectedDefenseZone;
  targetId: string;
}
export const TurnButton = ({ selectedAttackingZone, selectedDefenseZone, targetId }: Props) => {
  const { mutate, isPending } = useParticipantTurnMutation();
  const [isDelay, setIsDelay] = useState(false);
  const heroId = useHeroId();

  const onCLick = () => {
    setIsDelay(true);
    mutate({ attackingZone: selectedAttackingZone, defenseZone: selectedDefenseZone, heroId, targetId });
    setTimeout(() => {
      setIsDelay(false);
    }, 500);
  };
  return (
    <Button className="w-1/2" disabled={isPending || isDelay} onClick={onCLick}>
      Turn
    </Button>
  );
};
