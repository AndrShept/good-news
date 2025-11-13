import { Button } from '@/components/ui/button';
import { CraftItem } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCreateQueueCraftItemMutation } from '../../queue/hooks/useCreateQueueCraftItemMutation';

interface Props {
  craftItem: CraftItem | undefined;
}

export const CraftButton = ({ craftItem }: Props) => {
  const selectedResourceType = useCraftItemStore((state) => state.selectedResourceType);
  const { mutate, isPending } = useCreateQueueCraftItemMutation();
  return (
    <>
      <Button
        className="w-full"
        disabled={isPending || !craftItem || !selectedResourceType}
        onClick={() =>
          mutate({
            craftItemId: craftItem?.id ?? '',
            resourceType: selectedResourceType,
          })
        }
      >
        Craft
      </Button>
    </>
  );
};
