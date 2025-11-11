import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { TItemContainer } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

import { getItemContainerOptions } from '../api/get-item-container';

export const useItemContainer = <T = TItemContainer>(
  itemContainerId: string,
  fn?: (data: TItemContainer | undefined) => T,
): T | undefined => {
  const heroId = useHeroId();
  const { data } = useQuery({ ...getItemContainerOptions(heroId, itemContainerId), select: fn });

  return data;
};
