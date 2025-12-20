import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useQuery } from '@tanstack/react-query';

import { getItemContainerOptions } from '../api/get-item-container';
import { ItemContainer } from './ItemContainer';

type Props = {
  containerId: string;
};

export const BankItemContainer = ({ containerId }: Props) => {
  const heroId = useHeroId();
  const { data, isLoading } = useQuery(getItemContainerOptions(heroId, containerId));
  return <ItemContainer {...data!} isLoading={isLoading} />;
};
