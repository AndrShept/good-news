import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import React, { memo } from 'react';

import { getGroupMembersOptions } from '../api/get-group-members';
import { GroupMemberCard } from './GroupMemberCard';
import { GroupSkeleton } from './GroupSkeleton';
import { RemoveGroupButton } from './RemoveGroupButton';

export const GroupMembersList = memo(() => {
  const { group, groupId } = useHero((data) => ({
    groupId: data?.groupId ?? '',
    group: data?.group,
  }));

  const { data, isLoading } = useQuery(getGroupMembersOptions(groupId));
  const members = Array.from({ length: 3 }, (_, idx) => (data ? data[idx] : null));

  if (isLoading) {
    return <GroupSkeleton />;
  }
  return (
    <section className="flex flex-col gap-2">
      <ul className="mx-auto flex gap-2">
        {members?.map((member, idx) => (
          <GroupMemberCard
            leaderId={group?.leaderId}
            groupId={groupId}
            id={member?.id}
            avatarImage={member?.avatarImage}
            key={member?.id ? member.id : idx}
          />
        ))}
      </ul>
      <RemoveGroupButton groupId={groupId} />
    </section>
  );
});
