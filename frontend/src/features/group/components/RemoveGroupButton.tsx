import { Button } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useQueryClient } from '@tanstack/react-query';

import { getGroupAvailableHeroesOptions } from '../api/get-group-available-heroes';
import { useRemoveGroup } from '../hooks/useRemoveGroup';

interface Props {
  groupId: string;
}

export const RemoveGroupButton = ({ groupId }: Props) => {
  const heroId = useHeroId();
  const leaderId = useHero((state) => state?.data?.group?.leaderId ?? '');
  const isGroupLeader = leaderId === heroId;
  const { mutateAsync, isPending } = useRemoveGroup({ groupId });
  const queryClient = useQueryClient();

  return (
    <>
      {isGroupLeader && (
        <Button
          disabled={isPending}
          onClick={async () => {
            await mutateAsync(groupId);
            await queryClient.invalidateQueries({
              queryKey: getGroupAvailableHeroesOptions({
                searchTerm: '',
                selfId: heroId,
              }).queryKey,
            });
          }}
        >
          Remove Group
        </Button>
      )}
    </>
  );
};
