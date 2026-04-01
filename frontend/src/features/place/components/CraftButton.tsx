import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { imageConfig } from '@/shared/config/image-config';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCreateQueueCraftItemMutation } from '../../queue/hooks/useCreateQueueCraftItemMutation';

interface Props {
  recipeId: string;
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
      + Craft queue
    </Button>
  );
};
