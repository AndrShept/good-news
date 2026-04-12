import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { useShopItemStore } from '@/store/useShopItemStore';
import { X } from 'lucide-react';
import { memo } from 'react';

import { ShopStateType } from '../SelectedPlaceEntitiesPage';
import { ShopAcceptButton } from './ShopAcceptButton';

interface Props {
  setShopState: (state: ShopStateType | null) => void;
  shopState: ShopStateType | null;
}

export const ShopHeader = memo(({ setShopState, shopState }: Props) => {
  const { items, getTotalPrice, clearAllItems } = useShopItemStore();
  const totalPrice = getTotalPrice();
  const gold = useHero((data) => data?.goldCoins ?? 0);

  return (
    <section className="flex justify-between border-b p-2">
      <Button onClick={() => setShopState(null)}> {'< back'}</Button>
      <div className="flex items-center text-xl">
        <GameIcon className="size-6" image={imageConfig.icon.ui.gold} />
        <p className={cn(gold < totalPrice && 'text-red-500')}>{totalPrice}</p>
      </div>

      <div className="flex gap-0.5">
        <ShopAcceptButton
          items={items}
          iconImage={shopState === 'BUY' ? imageConfig.icon.ui.buy : imageConfig.icon.ui.sell}
          btnText={shopState === 'BUY' ? 'Buy' : 'Sell'}
        />
        <Button onClick={() => clearAllItems()} variant={'ghost'}>
          <X className="size-6 text-red-500/70" /> clear
        </Button>
      </div>
    </section>
  );
});
