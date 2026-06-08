import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { getBattleOptions } from '../api/get-battle';

export const useBattle = () => {
  const hero = useHero((data) => ({ id: data?.id ?? '', battleId: data?.battleId ?? '' }));
  const { data: battle } = useQuery(getBattleOptions(hero.id, hero.battleId));
  const { itemsTemplateById } = useGameData();
  const selfParticipant = battle?.participants.find((p) => p.id === hero.id);

  const isEquipLeftHandWeapon =
    selfParticipant?.equipments.some((e) => {
      const template = itemsTemplateById[e.itemTemplateId];
      return e.slot === 'LEFT_HAND' && template.type !== 'SHIELD';
    }) ?? false;
  const isEquipRightHandWeapon = selfParticipant?.equipments.some((e) => e.slot === 'RIGHT_HAND') ?? false;
  const isEquipShield =
    selfParticipant?.equipments.some((e) => {
      const template = itemsTemplateById[e.itemTemplateId];
      return e.slot === 'LEFT_HAND' && template.type === 'SHIELD';
    }) ?? false;

  const canMakeActionInTarget  = battle?.participants.some((p) =>
    battle.pendingActions.some(
      (a) => p.id === a.participantId && p.id === hero.id && p.targetId === a.targetId && a.actionType === 'NORMAL',
    ),
  );

  return {
    battle,
    isEquipLeftHandWeapon,
    isEquipRightHandWeapon,
    isEquipShield,
    selfParticipant,
    canMakeActionInTarget,
  };
};
