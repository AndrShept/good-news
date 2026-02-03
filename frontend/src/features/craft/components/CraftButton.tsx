import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { imageConfig } from '@/shared/config/image-config';
import {CraftBuildingType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCreateQueueCraftItemMutation } from '../../queue/hooks/useCreateQueueCraftItemMutation';

interface Props {
  recipeId: string;
  buildingType: CraftBuildingType;
}

export const CraftButton = ({ recipeId }: Props) => {
  const coreResourceId = useCraftItemStore((state) => state.coreResourceId);
  const { mutate, isPending } = useCreateQueueCraftItemMutation();
  return (
    <Button
      className="w-full"
      disabled={isPending || !recipeId}
      onClick={() =>
        mutate({
          recipeId,
          coreResourceId,
        
        })
      }
    >
      <GameIcon className='size-6.5' image={imageConfig.icon.state.BLACKSMITHING} />
      Add
    </Button>
  );
};
