import { Inventory } from '@/features/hero/components/Inventory';
import { Modifiers } from '@/features/hero/components/Modifier';
import { Paperdoll } from '@/features/hero/components/Paperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { createFileRoute } from '@tanstack/react-router';

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
