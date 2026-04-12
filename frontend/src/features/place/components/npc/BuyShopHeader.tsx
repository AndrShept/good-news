import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { ShopBuyButton } from '@/features/shop/components/ShopBuyButton';
import { imageConfig } from '@/shared/config/image-config';
import { useShopItemStore } from '@/store/useShopItemStore';
import { X } from 'lucide-react';

import { ShopStateType } from '../SelectedPlaceEntitiesPage';

interface Props {
  setShopState: (state: ShopStateType | null) => void;
}

export const BuyShopHeader = ({ setShopState }: Props) => {
  const { items, getTotalPrice, clearAllItems } = useShopItemStore();
  const totalPrice = getTotalPrice();

  return (
    <section className="flex justify-between border-b p-2">
      <Button onClick={() => setShopState(null)}> {'< back'}</Button>
      <div className="flex items-center text-xl">
        <GameIcon className="size-6" image={imageConfig.icon.ui.gold} />
        <p>{totalPrice}</p>
      </div>

      <div className="flex gap-0.5">
        <ShopBuyButton items={items} />
        <Button onClick={() => clearAllItems()} variant={'ghost'}>
          <X className="size-6 text-red-500/70" /> clear
        </Button>
      </div>
    </section>
  );
};
