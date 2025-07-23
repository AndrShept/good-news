import { HeroAvatar } from '@/components/HeroAvatar';
import { Button } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import React, { memo } from 'react';

import { getGroupMembersOptions } from '../api/get-group-members';
import { GroupSkeleton } from './GroupSkeleton';
import { RemoveGroupButton } from './RemoveGroupButton';

export const GroupMembersList = memo(() => {
  const { group, groupId } = useHero((state) => ({
    groupId: state?.data?.groupId ?? '',
    group: state?.data?.group,
  }));
  const heroId = useHeroId();
  const isGroupLeader = heroId === group?.leaderId;
  const { data, isLoading } = useQuery(getGroupMembersOptions(groupId));
  const members = Array.from({ length: 3 }, (_, idx) => (data ? data[idx] : null));

  if (isLoading) {
    return <GroupSkeleton />;
  }
  return (
    <section className="flex flex-col gap-2">
      <ul className="mx-auto flex gap-2">
        {members?.map((member, idx) => (
          <div className="flex flex-col items-center gap-1" key={member?.id ? member.id : idx}>
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
            {isGroupLeader && member?.id !== heroId && member?.id && (
              <Button size={'sm'} variant={'outline'}>
                kick
              </Button>
            )}
          </div>
        ))}
      </ul>
      <RemoveGroupButton groupId={groupId} />
    </section>
  );
});
