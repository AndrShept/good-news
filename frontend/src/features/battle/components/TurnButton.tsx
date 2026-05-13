import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { BattleShieldZoneType, BattleZoneType, EquipmentSlotType } from '@/shared/types';

import { useParticipantTurnMutation } from '../hooks/useParticipantTurnMutation';

interface Props {
  selectedAttackingZone: Record<Extract<EquipmentSlotType, 'LEFT_HAND' | 'RIGHT_HAND'>, BattleZoneType | null>;

  selectedDefenseZone: BattleZoneType | BattleShieldZoneType;
  targetId: string;
}
export const TurnButton = ({ selectedAttackingZone, selectedDefenseZone, targetId }: Props) => {
  const { mutate, isPending } = useParticipantTurnMutation();
  const heroId = useHeroId();
  return (
    <Button
      disabled={isPending}
      onClick={() => {
        mutate({ attackingZone: selectedAttackingZone, defenseZone: selectedDefenseZone, heroId, targetId });
      }}
    >
      Turn
    </Button>
  );
};
