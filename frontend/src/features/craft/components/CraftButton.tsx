import { Button } from '@/components/ui/button';
import { BuildingType, CraftItem } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCreateQueueCraftItemMutation } from '../../queue/hooks/useCreateQueueCraftItemMutation';

interface Props {
  craftItem: CraftItem | null | undefined;
  buildingType: BuildingType | undefined;
}

export const CraftButton = ({ craftItem, buildingType }: Props) => {
  const coreMaterialType = useCraftItemStore((state) => state.coreMaterialType);
  const { mutate, isPending } = useCreateQueueCraftItemMutation();
  return (
    <>
      <Button
        className="w-full"
        disabled={isPending || !craftItem || !buildingType}
        onClick={() =>
          mutate({
            craftItemId: craftItem?.id ?? '',
            coreMaterialType: coreMaterialType ? coreMaterialType : undefined,
            buildingType: buildingType!,
          })
        }
      >
        Craft
      </Button>
    </>
  );
};
