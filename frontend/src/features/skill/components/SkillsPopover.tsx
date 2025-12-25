import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
      <PopoverContent className="w-[320px]">
        <h2 className="text-center text-xl">Skills:</h2>
        <Separator className="mb-3 mt-1" />
        <SkillsList />
      </PopoverContent>
    </Popover>
  );
};
