import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { imageConfig } from '@/shared/config/image-config';

import { SkillsList } from './SkillsList';

export const SkillsPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <GameIcon image={imageConfig.icon.ui.skill} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-[70vh] w-[320px] p-0">
        <ScrollArea className="bg-secondary/50 h-full px-5 py-3">
          <h2 className="text-center text-xl">Skills:</h2>
          <Separator className="mb-3 mt-1" />
          <SkillsList />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
