import { GameAvatar } from '@/components/GameAvatar';
import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useAttackTarget } from '@/features/battle/hooks/useAttackTarget';
import { imageConfig } from '@/shared/config/image-config';
import { MapChunkEntitiesType, StateType } from '@/shared/types';
import { memo } from 'react';

interface Props {
  id: string;
  name: string;
  avatarImage: string;
  level?: number;
  state?: StateType;
  mode: 'PLACE' | 'MAP';
  entityType: MapChunkEntitiesType;
}

export const EntitySidebarCard = memo(function EntitySidebarCard({ id, name, avatarImage, level, state, entityType, mode }: Props) {
  const isCanAttack = mode === 'MAP' && entityType !== 'CORPSE';
  const { mutate, isPending } = useAttackTarget();
  return (
    <li className="mt-0.5 flex items-center gap-1.5 rounded-md px-2 py-1 duration-100 duration-75 hover:ring">
      <GameAvatar size={'sm'} src={avatarImage} />
      <div className="text-sm">
        <div className="inline-flex items-center gap-1">
          <span className="line-clamp-1 font-semibold">{name}</span>
          {state && <GameIcon className="size-4" image={imageConfig.icon.state[state]} />}
        </div>
        {level && <p className="text-muted-foreground">level: ({level})</p>}
      </div>
      {isCanAttack && (
        <Button
          disabled={isPending}
          onClick={() => mutate({ targetId: id, targetType: entityType })}
          className="ml-auto"
          variant="outline"
          size={'icon-sm'}
        >
          <GameIcon className="size-4" image={imageConfig.icon.ui.attack} />
        </Button>
      )}
    </li>
  );
});
