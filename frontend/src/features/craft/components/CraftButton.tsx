import { Button } from '@/components/ui/button';
import { CraftItem } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCraftItemMutation } from '../hooks/useCraftItemMutation';

interface Props {
  craftItem: CraftItem | undefined;
}

export const CraftButton = ({ craftItem }: Props) => {
  const selectedResourceType = useCraftItemStore((state) => state.selectedResourceType);
  const { mutate, isPending } = useCraftItemMutation();
  return (
    <Button
      disabled={isPending || !craftItem || !selectedResourceType}
      onClick={() =>
        mutate({
          craftItemId: craftItem?.id ?? '',
          resourceType: selectedResourceType,
        })
      }
      className="ml-auto"
    >
      Craft
    </Button>
  );
};
