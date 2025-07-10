import { useQueryClient } from '@tanstack/react-query';

import { getUserQueryOptions } from '../api/get-user';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(getUserQueryOptions().queryKey);

  return user;
};
