import { HeroAvatar } from '@/components/HeroAvatar';
import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import React, { memo } from 'react';

import { getGroupMembersOptions } from '../api/get-group-members';
import { GroupSkeleton } from './GroupSkeleton';
import { RemoveGroupButton } from './RemoveGroupButton';

export const GroupMembersList = memo(() => {
  const groupId = useHero((state) => state?.data?.groupId ?? '');

  const { data, isLoading } = useQuery(getGroupMembersOptions(groupId));
  const members = Array.from({ length: 3 }, (_, idx) => (data ? data[idx] : null));

  if (isLoading) {
    return <GroupSkeleton />;
  }
  return (
    <section className="flex flex-col gap-2">
      <ul className="mx-auto flex items-center gap-2">
        {members?.map((member, idx) => (
          <div key={member?.id ? member.id : idx}>
            {member && (
              <article>
                <HeroAvatar src={member?.avatarImage} />
              </article>
            )}
            {!member && (
              <div className="flex size-12 items-center justify-center rounded-full border">
                <PlusIcon />
                {/* <p className="text-muted-foreground text-center text-xs">slot {idx + 1}</p> */}
              </div>
            )}
          </div>
        ))}
      </ul>
      <RemoveGroupButton groupId={groupId} />
    </section>
  );
});
