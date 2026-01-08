import { GameIcon } from '@/components/GameIcon';
import { GameItemImg } from '@/components/GameItemImg';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { imageConfig } from '@/shared/config/image-config';
import { useShopItemStore } from '@/store/useShopItemStore';
import { X } from 'lucide-react';

export const ShopItemCardButton = () => {
  const { isOpen, toggleIsOpen, items, getTotalPrice, clearAllItems } = useShopItemStore();
  const totalPrice = getTotalPrice();
  return (
    <Sheet open={isOpen} onOpenChange={toggleIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant={'outline'} size="icon">
          Shop
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
                <div className="flex items-center truncate">
                  <GameItemImg className="size-8" image={item.image} />
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex">
                  <span className="text-yellow-300">x{item.quantity}</span>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="flex w-full flex-col gap-1 p-1">
          <div className="flex items-center gap-1">
            <p className="text-xl">Total Cost: {totalPrice} </p>
            <GameIcon className="size-6" image={imageConfig.icon.ui.gold} />
          </div>

          <Button className="flex-1">Buy</Button>
          <Button onClick={() => clearAllItems()} variant={'ghost'} className="mt-1">
            <X className="text-red-500/70" /> Clear All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
