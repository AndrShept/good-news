import { client } from '@/lib/utils';
import { User } from '@/shared/types';
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getUserQueryOptions } from '../api/get-user';

export const useAuth = () => {
  const { data } = useQuery({ ...getUserQueryOptions() });

  return data;
};
