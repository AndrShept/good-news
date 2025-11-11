import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { TItemContainer, ItemContainerType } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

import { getItemContainerByTypeOptions } from '../api/get-item-container-by-type';

export const useGetItemContainerByType = <T = TItemContainer>(type: ItemContainerType, fn?: (data: TItemContainer | undefined) => T): T | undefined => {
  const heroId = useHeroId();
  const { data } = useQuery({ ...getItemContainerByTypeOptions(heroId, type), select: fn });

  return data;
};
