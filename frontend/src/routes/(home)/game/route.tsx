import { GameMessage } from '@/components/GameMessage';
import { GoldIcon } from '@/components/game-icons/GoldIcon';
import { PremIcon } from '@/components/game-icons/PremIcon';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { HeroHeader } from '@/features/hero/components/HeroHeader';
import { useHero } from '@/features/hero/hooks/useHero';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

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
  // const { data } = useSuspenseQuery(getHeroOptions());

  return (
    <>
      <HeroHeader />

      <section className="size-full">
        <Outlet />
      </section>

      <section className="bg-background/90 sticky bottom-0 h-[250px]">
        <GameMessage />
      </section>
    </>
  );
}
