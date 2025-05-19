import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getUserQueryOptions());
    if (!user)
      throw redirect({
        to: '/auth',
      });

    const hero = await context.queryClient.ensureQueryData(getHeroOptions());
    if (!hero) {
      throw redirect({
        to: '/create-hero',
      });
    } else {
      throw redirect({
        to: '/game',
      });
    }
  },
});

function RouteComponent() {
  return <></>;
}
