import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/game/battle/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.hero?.battleId) {
      throw redirect({ to: '/game/battle/$battleId', params: { battleId: context.hero.battleId } });
    }
    throw redirect({ to: '/game' });
  },
});

function RouteComponent() {
  return <div>Hello "/game/battle"!</div>;
}
