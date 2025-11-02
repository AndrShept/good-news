import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React, { memo, useMemo, useState } from 'react';

import { HeroAvatar } from './HeroAvatar';

interface Props {
  avatar: string;
  setAvatar: (image: string) => void;
}

export const HeroAvatarList = memo(({ avatar, setAvatar }: Props) => {
  const avatars = useMemo(() => {
    return [...Array(48)].map((_, idx) => ({
      src: `/sprites/avatar/Icon${idx + 1}.png`,
    }));
  }, []);
  return (
    <ScrollArea className="h-[200px] md:h-[400px]">
      <ul className="flex max-w-[300px] flex-wrap gap-2">
        {avatars.map((item) => (
          <HeroAvatar
            key={item.src}
            setAvatar={() => setAvatar(item.src)}
            src={item.src}
            isSelected={avatar === item.src}
            className="cursor-pointer opacity-60 hover:opacity-100"
          />
        ))}
      </ul>
    </ScrollArea>
  );
});
