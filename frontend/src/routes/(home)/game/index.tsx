import { Inventory } from '@/features/hero/components/Inventory';
import { Modifiers } from '@/features/hero/components/Modifier';
import { Paperdoll } from '@/features/hero/components/Paperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { socket } from '@/main';
import { ApiHeroResponse } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/(home)/game/')({
  component: RouteComponent,
});

function RouteComponent() {
  const avatarImage = useHero((state) => state?.data?.avatarImage ?? '');
  const name = useHero((state) => state?.data?.name ?? '');
  const id = useHero((state) => state?.data?.id ?? '');
  const currentExperience = useHero((state) => state?.data?.currentExperience ?? 0);
  const maxExperience = useHero((state) => state?.data?.maxExperience ?? 0);
  const currentHealth = useHero((state) => state?.data?.currentHealth ?? 0);
  const currentMana = useHero((state) => state?.data?.currentMana ?? 0);
  const maxHealth = useHero((state) => state?.data?.maxHealth ?? 0);
  const maxMana = useHero((state) => state?.data?.maxMana ?? 0);
  const level = useHero((state) => state?.data?.level ?? 0);
  const equipments = useHero((state) => state?.data?.equipments ?? []);

  const isFullHealth = currentHealth >= maxHealth;
  const isFullMana = currentMana >= maxMana;
  const queryClient = useQueryClient();
  useEffect(() => {
    const listener = (data: { currentHealth: number } | { currentMana: number }) => {
      queryClient.setQueryData<ApiHeroResponse>(['hero'], (oldData) => {
        if (!oldData || !oldData.data) return;

        return { ...oldData, data: { ...oldData.data, ...data } };
      });
    };

    if (!isFullHealth) {
      socket.emit('go-health', id);
      socket.on(`health-regeneration-${id}`, listener);
    }
    if (!isFullMana) {
      socket.emit('go-mana', id);
      socket.on(`mana-regeneration-${id}`, listener);
    }
    return () => {
      socket.off(`health-regeneration`, listener);
      socket.off(`mana-regeneration-${id}`, listener);
    };
  }, [id, isFullHealth, isFullMana]);
  return (
    <div className="flex gap-4">
      <Paperdoll
        avatarImage={avatarImage}
        currentExperience={currentExperience}
        currentHealth={currentHealth}
        currentMana={currentMana}
        id={id}
        level={level}
        maxExperience={maxExperience}
        maxHealth={maxHealth}
        maxMana={maxMana}
        name={name}
        equipments={equipments}
      />
      <Modifiers />
      <Inventory />
    </div>
  );
}
