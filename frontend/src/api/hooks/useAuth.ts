import { getUserQueryOptions } from '@/api/auth-api';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData( getUserQueryOptions().queryKey );

  return user;
};
