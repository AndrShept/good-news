import { CounterBadge } from '@/components/CounterBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeroSidebarItem, MapCorpse, MapCreature } from '@/shared/types';
import { memo } from 'react';

import { EntitySidebarCard } from './EntitySidebarCard';
import { HeroSidebarListSkeleton } from './HeroSidebarListSkeleton';

interface Props {
  heroes: HeroSidebarItem[] | undefined;
  creatures: MapCreature[] | undefined;
  corpses: MapCorpse[] | undefined;
  mode: 'PLACE' | 'MAP';

  isLoading: boolean;
}

export const EntitySidebar = memo(({ heroes, corpses, creatures, mode, isLoading }: Props) => {
  if (isLoading) return <HeroSidebarListSkeleton />;
  return (
    <aside className="hidden w-full max-w-[200px] select-text flex-col gap-1 sm:flex">
      {mode === 'PLACE' ? (
        heroes?.map((hero) => (
          <EntitySidebarCard key={hero.id} avatarImage={hero.avatarImage} name={hero.name} state={hero.state} level={hero.level} />
        ))
      ) : (
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="w-full p-0">
            <TabsTrigger className="relative p-0 text-[13px]" value="hero">
              hero
              {!!heroes?.length && <CounterBadge value={heroes.length} className="top-9.5 size-4.5 -translate-1/2 left-1/2 bg-teal-800" />}
            </TabsTrigger>
            <TabsTrigger className="relative p-0 text-[13px]" value="creature">
              creature
              {!!creatures?.length && (
                <CounterBadge value={creatures.length} className="top-9.5 size-4.5 -translate-1/2 left-1/2 bg-teal-800" />
              )}
            </TabsTrigger>
            <TabsTrigger className="relative p-0 text-[13px]" value="corpse">
              corpse
              {!!corpses?.length && (
                <CounterBadge value={corpses.length} className="top-9.5 size-4.5 -translate-1/2 left-1/2 bg-teal-800" />
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hero">
            {heroes?.map((hero) => (
              <EntitySidebarCard key={hero.id} avatarImage={hero.avatarImage} name={hero.name} state={hero.state} level={hero.level} />
            ))}
          </TabsContent>
          <TabsContent value="creature">
            {creatures?.map((creature) => <EntitySidebarCard key={creature.id} avatarImage={creature.image} name={creature.name} />)}
          </TabsContent>
          <TabsContent value="corpse">
            {corpses?.map((corpse) => <EntitySidebarCard key={corpse.id} avatarImage={corpse.image} name={corpse.name} />)}
          </TabsContent>
        </Tabs>
      )}
    </aside>
  );
});
