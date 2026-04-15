import { GameIcon } from '@/components/GameIcon';
import { GameItemImg } from '@/components/GameItemImg';
import { TINT_COLOR } from '@/lib/config';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { ColoredResourceType } from '@/shared/types';
import { useShopItemStore } from '@/store/useShopItemStore';
import { memo } from 'react';

interface Props {
  id: string;
  image: string;
  name: string;
  price: number;
  templateKey: string;
  isSelect: boolean;
}

export const NpcBuyItemCard = memo(function NpcBuyItemCard({ image, name, price, id, templateKey, isSelect }: Props) {
  const addShopItem = useShopItemStore((state) => state.addShopItem);

  const handleClick = () => {
    addShopItem({
      id,
      name,
      image,
      quantity: 1,
      price,
    });
  };
  return (
    <li
      onClick={handleClick}
      className={cn(
        'relative flex select-none items-center gap-1 rounded-md border border-transparent px-1.5 py-0.5 shadow-2xl hover:cursor-default hover:bg-emerald-500/10',
        {
          'border-emerald-500/10': isSelect,
        },
      )}
    >
      <GameItemImg tintColor={TINT_COLOR[templateKey as ColoredResourceType]} className="size-10" image={image} />
      <div className="flex flex-col gap-0.5 truncate text-sm capitalize">
        <span className="truncate">{name}</span>
        <div className="flex items-center gap-0.5">
          <GameIcon className="size-5" image={imageConfig.icon.ui.gold} />
          <span>{price}</span>
        </div>
      </div>
    </li>
  );
});
