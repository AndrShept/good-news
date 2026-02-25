import { Hero, ItemInstance } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';

export const useEquipmentsUpdate = () => {
  const queryClient = useQueryClient();

  const updateEquip = (itemInstanceId: string, updateData: Partial<ItemInstance>) => {
    queryClient.setQueryData<Hero>(getHeroOptions().queryKey, (oldData) => {
      if (!oldData) return;

      return { ...oldData, equipments: oldData.equipments.map((e) => (e.id === itemInstanceId ? { ...e, ...updateData } : e)) };
    });
  };
  const removeEquip = (itemInstanceId: string) => {
    queryClient.setQueryData<Hero>(getHeroOptions().queryKey, (oldData) => {
      if (!oldData) return;

      return { ...oldData, equipments: oldData.equipments.filter((e) => e.id !== itemInstanceId) };
    });
  };
  const addEquip = (newEquip: ItemInstance) => {
    queryClient.setQueryData<Hero>(getHeroOptions().queryKey, (oldData) => {
      if (!oldData) return;

      return { ...oldData, equipments: [...oldData.equipments, newEquip] };
    });
  };

  return { updateEquip, removeEquip, addEquip };
};
