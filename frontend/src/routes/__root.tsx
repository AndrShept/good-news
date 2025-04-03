import { getUserQueryOptions } from '@/api/auth-api';
import { Spinner } from '@/components/Spinner';
import { useQuery } from '@tanstack/react-query';
import {  Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { isLoading } = useQuery(getUserQueryOptions());
  if (isLoading)
    return (
      <div className="flex h-screen">
        <Spinner />
      </div>
    );

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
