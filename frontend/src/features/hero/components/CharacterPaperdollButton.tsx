import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { imageConfig } from '@/shared/config/image-config';
import { HeaderUIType, useGameUIStore } from '@/store/useGameUIStore';
import { startTransition } from 'react';

import { useHero } from '../hooks/useHero';

type Props = {
  type: HeaderUIType;
};

export const CharacterPaperdollButton = (props: Props) => {
  const icon: Record<HeaderUIType, string> = {
    CHARACTER: imageConfig.icon.ui.character,
  };
  const { headerUIType, setHeaderUIType } = useGameUIStore();
  const state = useHero((data) => data?.state);
  return (
    <Button
      onClick={() => {
        startTransition(() => {
          setHeaderUIType(props.type);
        });
      }}
      size="icon-lg"
      disabled={state !== 'IDLE'}
      variant={headerUIType === props.type ? 'secondary' : 'outline'}
    >
      <GameIcon className="size-6" image={icon[props.type]} />
    </Button>
  );
};
