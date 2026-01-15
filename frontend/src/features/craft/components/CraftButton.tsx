import { Button } from '@/components/ui/button';
import { BuildingType, CraftItem } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCreateQueueCraftItemMutation } from '../../queue/hooks/useCreateQueueCraftItemMutation';

interface Props {
  recipeId: string;
  buildingType: BuildingType | undefined;
}

export const CraftButton = ({ recipeId, buildingType }: Props) => {
  const coreMaterialId = useCraftItemStore((state) => state.coreMaterialId);
  const { mutate, isPending } = useCreateQueueCraftItemMutation();
  return (
    <>
      <Button
        className="w-full"
        disabled={isPending || !recipeId || !buildingType}
        onClick={() =>
          mutate({
            craftItemId: recipeId ?? '',
            coreMaterialType: coreMaterialId,
            buildingType: buildingType!,
          })
        }
      >
        Craft
      </Button>
    </>
  );
};
