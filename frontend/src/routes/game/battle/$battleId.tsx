import { Spinner } from '@/components/Spinner';
import { getBattleOptions } from '@/features/battle/api/get-battle';
import { BattleParticipantCard } from '@/features/battle/components/BattleParticipantCard';
import { BattleParticipantList } from '@/features/battle/components/BattleParticipantList';
import { ZoneSelector } from '@/features/battle/components/ZoneSelector';
import { useBattle } from '@/features/battle/hooks/useBattle';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { createFileRoute } from '@tanstack/react-router';

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
  loader: async ({ params, context }) => {
    const heroId = context?.hero?.id ?? '';
    const data = await context.queryClient.ensureQueryData(getBattleOptions(heroId, params.battleId));
    return data;
  },
});

function RouteComponent() {
  const battle = Route.useLoaderData();
  const heroId = useHeroId();
  const opponentParticipant = battle?.participants.find((p) => p.id !== heroId);
  const attackers = battle?.participants.filter((p) => p.side === 'ATTACKER');
  const defenders = battle?.participants.filter((p) => p.side === 'DEFENDER');
  const { isEquipLeftWeapon, isEquipRightHand, isEquipShield, selfParticipant } = useBattle();
  if (!selfParticipant || !opponentParticipant) return;
  return (
    <div className="mx-auto flex h-fit w-full max-w-5xl justify-between p-2">
      <BattleParticipantCard {...selfParticipant} />
      <div className="flex flex-col gap-1">
        <ZoneSelector isEquipLeftWeapon={isEquipLeftWeapon && isEquipRightHand} isEquipShield={isEquipShield} />
        <BattleParticipantList attackers={attackers} defenders={defenders} />
      </div>
      <BattleParticipantCard {...opponentParticipant} />
    </div>
  );
}
