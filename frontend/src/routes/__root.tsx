import { SocketProvider } from '@/components/providers/SocketProvider';
import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { MyRouterContext } from '@/main';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getUserQueryOptions());
    return user;
  },
});

function Root() {
  const user = Route.useLoaderData({
    select(match) {
      if (!match) return undefined;
      return {
        username: match.username,
        id: match.id,
      };
    },
  });
  return (
    <>
      <SocketProvider user={user}>
        <Outlet />
      </SocketProvider>
    </>
  );
}
