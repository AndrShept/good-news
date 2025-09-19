import { createFileRoute } from '@tanstack/react-router';

import { NewGameMap } from '@/features/map/components/NewGameMap';

export const Route = createFileRoute('/(home)/test')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <NewGameMap />
    </div>
  );
}
