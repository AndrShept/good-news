import { getHeroOptions } from '@/features/hero/api/get-hero';
import { Inventory } from '@/features/hero/components/Inventory';
import { Modifiers } from '@/features/hero/components/Modifier';
import { Paperdoll } from '@/features/hero/components/Paperdoll';
import { useHero } from '@/hooks/useHero';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { use } from 'react';

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
  const hero = useSuspenseQuery(getHeroOptions());
  return (
    <section className="flex min-h-full gap-4">
      <Paperdoll hero={hero.data!.data!} />
      <Modifiers />
      <Inventory />
    </section>
  );
}
