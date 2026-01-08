import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useShopItemStore } from '@/store/useShopItemStore';

export const ShopItemCardSheet = () => {
  const { isOpen, toggleIsOpen, items } = useShopItemStore();

  return (
    <Sheet open={isOpen} onOpenChange={toggleIsOpen} modal={false}>
      <SheetContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="w-41 p-1 md:w-full"
      >
        <SheetTitle className="hidden"></SheetTitle>

        {items?.map((item) => <div key={item.id}>{item.image}</div>)}
      </SheetContent>
    </Sheet>
  );
};
