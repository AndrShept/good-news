import { getHeroOptions } from '@/features/hero/api/get-hero';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)/game')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth)
      throw redirect({
        to: '/auth',
      });

    const res = await context.queryClient.ensureQueryData(getHeroOptions());
    if (!res)
      throw redirect({
        to: '/create-hero',
      });
  },
});

function RouteComponent() {
  return <section className="flex min-h-full flex-col">GAME</section>;
}
