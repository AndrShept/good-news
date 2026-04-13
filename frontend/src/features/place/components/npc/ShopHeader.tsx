import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { useNpcStore } from '@/store/useNpcStore';
import { useShopItemStore } from '@/store/useShopItemStore';
import { X } from 'lucide-react';

import { ShopAcceptButton } from './ShopAcceptButton';

export const ShopHeader = () => {
  const { items, getTotalPrice, clearAllItems } = useShopItemStore();
  const totalPrice = getTotalPrice();
  const gold = useHero((data) => data?.goldCoins ?? 0);
  const setNpcActiveTab = useNpcStore((state) => state.setNpcActiveTab);
  const npcActiveTab = useNpcStore((state) => state.npcActiveTab);

  return (
    <section className="flex justify-between border-b p-2">
      <Button onClick={() => setNpcActiveTab(null)}> {'< back'}</Button>
      <div className="flex items-center text-xl">
        <GameIcon className="size-6" image={imageConfig.icon.ui.gold} />
        <p className={cn(gold < totalPrice && 'text-red-500')}>{totalPrice}</p>
      </div>

      <div className="flex gap-0.5">
        <ShopAcceptButton
          items={items}
          iconImage={npcActiveTab === 'BUY' ? imageConfig.icon.ui.buy : imageConfig.icon.ui.sell}
          btnText={npcActiveTab === 'BUY' ? 'Buy' : 'Sell'}
        />
        <Button onClick={() => clearAllItems()} variant={'ghost'}>
          <X className="size-6 text-red-500/70" /> clear
        </Button>
      </div>
    </section>
  );
};
