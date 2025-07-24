import { useMutation } from '@tanstack/react-query';

import { leaveGroupMember } from '../api/leave-group-member';

export const useLeaveMemberMutation = () => {
  return useMutation({
    mutationFn: leaveGroupMember,
  });
};
