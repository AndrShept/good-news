import { Spinner } from '@/components/Spinner';
import { getBattleOptions } from '@/features/battle/api/get-battle';
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
  return <div>Hello "/game/battle/$battleId"! </div>;
}
