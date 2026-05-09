import { Spinner } from '@/components/Spinner';
import { getBattleOptions } from '@/features/battle/api/get-battle';
import { BattleParticipantCard } from '@/features/battle/components/BattleParticipantCard';
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
  const selfParticipant = battle?.participants.find((p) => p.id === heroId);
  const opponentParticipant = battle?.participants.find((p) => p.id !== heroId);
  const attackers = battle?.participants.filter((p) => p.side === 'ATTACKER');
  const defenders = battle?.participants.filter((p) => p.side === 'DEFENDER');
  if (!selfParticipant || !opponentParticipant) return;
  return (
    <div className="mx-auto flex h-fit w-full max-w-5xl justify-between p-2">
      <BattleParticipantCard {...selfParticipant} />
      <div className="text-muted-foreground mt-auto flex gap-2">
        <ul>{attackers?.map((a) => <li>{a.name}</li>)}</ul>
        <p className="text-red-500">vs</p>
        <ul>{defenders?.map((a) => <li>{a.name}</li>)}</ul>
      </div>
      <BattleParticipantCard {...opponentParticipant} />
    </div>
  );
}
