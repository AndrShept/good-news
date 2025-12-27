import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { imageConfig } from '@/shared/config/image-config';
import { useBackpack } from '@/store/useBackpack';

import { HeroBackpack } from './HeroBackpack';

export const BackpackButton = () => {
  const isOpen = useBackpack((state) => state.isOpen);
  const onOpen = useBackpack((state) => state.onOpen);
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpen} modal={false}>
        <SheetTrigger asChild>
          <Button variant={isOpen ? 'default' : 'outline'} size="icon">
            <GameIcon image={imageConfig.icon.ui.backpack} />
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
