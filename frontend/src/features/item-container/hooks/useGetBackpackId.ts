import { getHeroOptions } from '@/features/hero/api/get-hero';
import { useQueryClient } from '@tanstack/react-query';

export const useGetBackpackId = () => {
  const queryClient = useQueryClient();
  const itemContainer = queryClient.getQueryData(getHeroOptions().queryKey)?.itemContainers?.find((item) => item.type === 'BACKPACK');

  return itemContainer!.id;
};
