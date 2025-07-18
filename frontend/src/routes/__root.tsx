import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { MyRouterContext } from '@/main';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getUserQueryOptions());
    return user;
  },
});

function Root() {
  return (
    <>
      <Outlet />
    </>
  );
}
