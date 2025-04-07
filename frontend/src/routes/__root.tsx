import { User } from '@/shared/types';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

interface MyRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: User| undefined;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
