import { HeroAvatar } from '@/components/HeroAvatar';
import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { PlusIcon } from 'lucide-react';

import { useKickMemberMutation } from '../hooks/useKickMemberMutation';
import { useLeaveMemberMutation } from '../hooks/useLeaveMemberMutation';

interface Props {
  leaderId: string | undefined;
  avatarImage: string | undefined;
  id: string | undefined;
  groupId: string;
}

export const GroupMemberCard = ({ avatarImage, leaderId, id, groupId }: Props) => {
  const heroId = useHeroId();
  const isGroupLeader = heroId === leaderId;
  const isKickAllowed = isGroupLeader && id !== heroId && id;
  const isCanLeave = heroId === id && !isGroupLeader;
  const kickMutation = useKickMemberMutation();
  const leaveMutation = useLeaveMemberMutation();
  return (
    <article className="flex flex-col items-center gap-1">
      {id && (
        <article>
          <HeroAvatar src={avatarImage ?? ''} />
        </article>
      )}
      {!id && (
        <div className="flex size-12 items-center justify-center rounded-full border">
          <PlusIcon />
          {/* <p className="text-muted-foreground text-center text-xs">slot {idx + 1}</p> */}
        </div>
      )}
      {isKickAllowed && (
        <Button
          disabled={kickMutation.isPending}
          onClick={() => kickMutation.mutate({ groupId, memberId: id })}
          size={'sm'}
          variant={'outline'}
        >
          kick
        </Button>
      )}
      {isCanLeave && (
        <Button
          disabled={leaveMutation.isPending}
          onClick={() => leaveMutation.mutate({ groupId, memberId: id })}
          size={'sm'}
          variant={'outline'}
        >
          leave
        </Button>
      )}
    </article>
  );
};
