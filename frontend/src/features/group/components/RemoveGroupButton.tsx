import { Button } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';

import { useRemoveGroupMutation } from '../hooks/useRemoveGroupMutation';

interface Props {
  groupId: string;
}

export const RemoveGroupButton = ({ groupId }: Props) => {
  const heroId = useHeroId();
  const leaderId = useHero((data) => data?.group?.leaderId ?? '');
  const isGroupLeader = leaderId === heroId;
  const { mutate, isPending } = useRemoveGroupMutation();

  return (
    <>
      {isGroupLeader && (
        <Button
          disabled={isPending}
          onClick={() => {
            mutate(groupId);
          }}
        >
          Remove Group
        </Button>
      )}
    </>
  );
};
