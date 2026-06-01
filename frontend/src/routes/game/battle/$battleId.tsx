import { Spinner } from '@/components/Spinner';
import { getBattleOptions } from '@/features/battle/api/get-battle';
import { BattleParticipantCard } from '@/features/battle/components/BattleParticipantCard';
import { BattleParticipantList } from '@/features/battle/components/BattleParticipantList';
import { ZoneSelector } from '@/features/battle/components/ZoneSelector';
import { useBattle } from '@/features/battle/hooks/useBattle';
import { useHero } from '@/features/hero/hooks/useHero';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/game/battle/$battleId')({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-[calc(100vh-310px)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner size={'sm'} />
        <p className="m-auto">Loading Battle...</p>
      </div>
    </div>
  ),
  beforeLoad: ({ context }) => {
    const battleId = context.hero.battleId;

    if (!battleId) {
      throw redirect({ to: '/game' });
    }
  },
  loader: async ({ params, context }) => {
    const heroId = context?.hero?.id ?? '';
    const data = await context.queryClient.ensureQueryData(getBattleOptions(heroId, params.battleId));
    if (!data) throw redirect({ to: '/game' });
    return data;
  },

});

function RouteComponent() {
  const { battle, isEquipLeftHandWeapon, isEquipRightHandWeapon, isEquipShield, selfParticipant } = useBattle();
  const navigate = useNavigate();
  const battleId = useHero((data) => data?.battleId);
  const targetParticipant = battle?.participants.find((p) => p.id === selfParticipant?.targetId);
  const attackers = battle?.participants.filter((p) => p.side === 'ATTACKER');
  const defenders = battle?.participants.filter((p) => p.side === 'DEFENDER');
  const setConsoleTab = useGameUIStore((state) => state.setConsoleTab);
  const defaultTab = useGameUIStore((state) => state.consoleTab.default);

  useEffect(() => {
    if (!battleId) {
      navigate({ to: '/game' });
    }
  }, [battleId]);

  useEffect(() => {
    setConsoleTab({ active: 'LOG' });
    return () => {
      setConsoleTab({ active: defaultTab });
    };
  }, []);
  
  if (!selfParticipant || !battle) return;

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center p-2">
      <div className="flex w-full justify-between gap-1">
        <BattleParticipantCard {...selfParticipant} />

        <ZoneSelector
          isEquipLeftHandWeapon={isEquipLeftHandWeapon}
          isEquipRightHandWeapon={isEquipRightHandWeapon}
          isEquipShield={isEquipShield}
          currentRound={battle.currentRound}
          roundEndsAt={battle.roundEndsAt}
          targetId={selfParticipant.targetId ?? ''}
        />

        {targetParticipant && <BattleParticipantCard {...targetParticipant} />}
      </div>

      <BattleParticipantList selfParticipant={selfParticipant} attackers={attackers} defenders={defenders} />
    </section>
  );
}
