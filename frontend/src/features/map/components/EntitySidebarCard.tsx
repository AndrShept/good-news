import { GameAvatar } from '@/components/GameAvatar';
import { GameIcon } from '@/components/GameIcon';
import { imageConfig } from '@/shared/config/image-config';
import { StateType } from '@/shared/types';
import { memo } from 'react';

interface Props {
  name: string;
  avatarImage: string;
  level?: number;
  state?: StateType;
}

export const EntitySidebarCard = memo(function EntitySidebarCard({ name, avatarImage, level, state }: Props) {
  return (
    <li className="hover:bg-secondary mt-0.5 flex items-center gap-1.5 rounded px-2 py-1 duration-75">
      <GameAvatar size={'sm'} src={avatarImage} />
      <div className="text-sm">
        <div className="inline-flex items-center gap-1">
          <span className="line-clamp-1 font-semibold">{name}</span>
          {state && <GameIcon className="size-4" image={imageConfig.icon.state[state]} />}
        </div>
        {level && <p className="text-muted-foreground">level: ({level})</p>}
      </div>
    </li>
  );
});
