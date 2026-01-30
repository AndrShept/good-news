import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { imageConfig } from '@/shared/config/image-config';
import { BuildingType, CraftBuildingType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCreateQueueCraftItemMutation } from '../../queue/hooks/useCreateQueueCraftItemMutation';

interface Props {
  recipeId: string;
  buildingType: CraftBuildingType;
}

export const CraftButton = ({ recipeId, buildingType }: Props) => {
  const coreResourceId = useCraftItemStore((state) => state.coreResourceId);
  const { mutate, isPending } = useCreateQueueCraftItemMutation();
  return (
    <Button
      className="w-full"
      disabled={isPending || !recipeId || !buildingType}
      onClick={() =>
        mutate({
          craftItemId: recipeId ?? '',
          coreMaterialType: coreResourceId,
          buildingType: buildingType,
        })
      }
    >
      <GameIcon image={imageConfig.icon.state.BLACKSMITHING} />
      Craft
    </Button>
  );
};
