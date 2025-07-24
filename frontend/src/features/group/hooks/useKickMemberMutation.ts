import { useMutation } from '@tanstack/react-query';
import { kickGroupMember } from '../api/kick-group-member';


export const useKickMemberMutation = () => {
  return useMutation({
    mutationFn: kickGroupMember,
  });
};
