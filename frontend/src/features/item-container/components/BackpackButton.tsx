import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { imageConfig } from '@/shared/config/image-config';
import { useSheetStore } from '@/store/useBackpackStore';

import { HeroBackpack } from './HeroBackpack';

export const BackpackButton = () => {
  const isBackpackOpen = useSheetStore((state) => state.isBackpackOpen);
  const onBackpackToggle = useSheetStore((state) => state.onBackpackToggle);
  return (
    <>
      <Sheet open={isBackpackOpen} onOpenChange={onBackpackToggle} modal={false}>
        <SheetTrigger asChild>
          <Button variant={isBackpackOpen ? 'secondary' : 'outline'} size="icon-lg">
            <GameIcon className="size-6.5" image={imageConfig.icon.ui.backpack} />
          </Button>
        </SheetTrigger>
        <SheetContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="w-41 p-1 md:w-full"
        >
          <SheetTitle className="hidden"></SheetTitle>
          <HeroBackpack />
        </SheetContent>
      </Sheet>
    </>
  );
};
