import { Inventory } from '@/features/hero/components/Inventory';
import { Modifiers } from '@/features/hero/components/Modifier';
import { Paperdoll } from '@/features/hero/components/Paperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { useSocket } from '@/hooks/useSocket';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/(home)/game/')({
  component: RouteComponent,
});

function RouteComponent() {
  const hero = useHero();
  const { socket } = useSocket();

  useEffect(() => {
    if (hero.currentHealth < hero.maxHealth) {
      socket?.emit('regen', hero.currentHealth);
    }
    socket?.on('health', (data) => {
      console.log(data);
    });
  }, [hero.currentHealth, hero.maxHealth, socket]);
  return (
    <div className="flex gap-4">
      <Paperdoll hero={hero} />
      <Modifiers />
      <Inventory />
    </div>
  );
}
