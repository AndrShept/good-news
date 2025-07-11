import { MyRouterContext } from '@/main';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <Outlet />
    </>
  );
}
