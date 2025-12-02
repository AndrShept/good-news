import { Button } from '@/components/ui/button';
import { CraftItem } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCreateQueueCraftItemMutation } from '../../queue/hooks/useCreateQueueCraftItemMutation';

interface Props {
  craftItem: CraftItem | null | undefined;
}

export const CraftButton = ({ craftItem }: Props) => {
  const coreMaterialType = useCraftItemStore((state) => state.coreMaterialType);
  const { mutate, isPending } = useCreateQueueCraftItemMutation();
  return (
    <>
      <Button
        className="w-full"
        disabled={isPending || !craftItem || !coreMaterialType}
        onClick={() =>
          mutate({
            craftItemId: craftItem?.id ?? '',
            coreMaterialType: coreMaterialType!,
          })
        }
      >
        Craft
      </Button>
    </>
  );
};
