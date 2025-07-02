import { getHeroOptions } from '@/features/hero/api/get-hero';
import { FillBar } from '@/features/hero/components/FillBar';
import { Inventory } from '@/features/hero/components/Inventory';
import { Modifiers } from '@/features/hero/components/Modifier';
import { Paperdoll } from '@/features/hero/components/Paperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { useSocket } from '@/hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/(home)/game/')({
  component: RouteComponent,
});

function RouteComponent() {
  const hero = useHero();

  
  return (
    <div className="flex gap-4">
      <Paperdoll hero={hero} />
      <Modifiers />
      <Inventory />
    </div>
  );
}
