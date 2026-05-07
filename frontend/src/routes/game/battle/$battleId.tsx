import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/battle/$battleId')({
  component: RouteComponent,
});

function RouteComponent() {
  const das = Route.useParams();

  return <div>Hello "/game/battle/$battleId"! {das.battleId}</div>;
}
