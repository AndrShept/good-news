import { getUserQueryOptions } from '@/api/api';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const queryKey = getUserQueryOptions().queryKey;
  const user = queryClient.getQueryData(queryKey);
  return user;
};
