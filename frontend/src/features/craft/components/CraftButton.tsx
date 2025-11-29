import { Button } from '@/components/ui/button';
import { CraftItem } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCreateQueueCraftItemMutation } from '../../queue/hooks/useCreateQueueCraftItemMutation';

interface Props {
  craftItem: CraftItem | null | undefined;
}

export const CraftButton = ({ craftItem }: Props) => {
  const baseResourceType = useCraftItemStore((state) => state.baseResourceType);
  const { mutate, isPending } = useCreateQueueCraftItemMutation();
  return (
    <>
      <Button
        className="w-full"
        disabled={isPending || !craftItem || !baseResourceType}
        onClick={() =>
          mutate({
            craftItemId: craftItem?.id ?? '',
            baseResourceType: baseResourceType!,
          })
        }
      >
        Craft
      </Button>
    </>
  );
};
