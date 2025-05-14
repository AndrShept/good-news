import { Inventory } from '@/features/hero/components/Inventory';
import { Modifiers } from '@/features/hero/components/Modifier';
import { Paperdoll } from '@/features/hero/components/Paperdoll';
import { useHero } from '@/hooks/useHero';
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
      <div className="w-[150px] h-[250px] shrink-0 border rounded  flex items-center justify-center">
        <img className="size-full object-contain scale-x-[-1] " src="/sprites/new/mobs.jpg" alt="mob-image" style={{ imageRendering: 'pixelated' }} />
      </div>
    </div>
  );
}
