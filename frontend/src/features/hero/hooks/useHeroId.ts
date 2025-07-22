import { useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';

export const useHeroId = () => {
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData(getHeroOptions().queryKey);
  return data?.data?.id ?? '';
};
