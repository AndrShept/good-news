import { CounterBadge } from '@/components/CounterBadge';
import { GameIcon } from '@/components/GameIcon';
import { GameItemImg } from '@/components/GameItemImg';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { imageConfig } from '@/shared/config/image-config';
import { useShopItemStore } from '@/store/useShopItemStore';
import { X } from 'lucide-react';

import { ShopBuyButton } from './ShopBuyButton';

export const ShopItemCardButton = () => {
  const { isOpen, toggleIsOpen, items, getTotalPrice, clearAllItems, getTotalQuantity, decrement, increment } = useShopItemStore();
  const totalPrice = getTotalPrice();
  const totalQuantity = getTotalQuantity();
  if (!totalQuantity) return;
  return (
    <Sheet open={isOpen} onOpenChange={toggleIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant={'outline'} size="icon" className="relative">
          <GameIcon image={imageConfig.icon.ui['shop-cart']} />
          <CounterBadge value={totalQuantity} />
        </Button>
      </SheetTrigger>
      <SheetContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="w-50 p-1 md:w-full"
      >
        <SheetTitle className="hidden"></SheetTitle>

        <h2 className="text-center text-xl">Buy Item</h2>
        <ScrollArea className="h-full min-h-0">
          <ul className="flex min-h-0 flex-col gap-0.5 md:px-3">
            {items?.map((item) => (
              <li className="flex flex-col items-center justify-between gap-1 md:flex-row" key={item.id}>
                <div className="flex w-full flex-col items-center truncate md:flex-row md:gap-4">
                  <div className="flex items-center gap-1 truncate">
                    <GameItemImg className="size-8" image={item.image} />
                    <span className="truncate">{item.name}</span>
                  </div>

                  <span className="text-muted-foreground md:ml-auto">{item.quantity * item.price}</span>
                </div>
                <div className="flex gap-0.5">
                  <Button onClick={() => decrement(item.id)} className="size-6" variant={'ghost'} size={'icon'}>
                    -
                  </Button>
                  <span className="text-yellow-300">{item.quantity}</span>

                  <Button onClick={() => increment(item.id)} className="size-5.5" variant={'ghost'} size={'icon'}>
                    +
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="flex w-full flex-col gap-1 px-3">
          <div className="flex items-center justify-center gap-1">
            <p className="w-fit md:text-xl">Total Cost: {totalPrice} </p>
            <GameIcon className="size-6" image={imageConfig.icon.ui.gold} />
          </div>
          <ShopBuyButton items={items} />
          <Button onClick={() => clearAllItems()} variant={'outline'} className="mt-1">
            <X className="text-red-500/70 size-6" /> Clear All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
