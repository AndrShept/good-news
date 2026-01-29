import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { imageConfig } from '@/shared/config/image-config';
import { HeroUIType, useHeroUIStore } from '@/store/useHeroUIStore';

import { useHero } from '../hooks/useHero';
import { startTransition } from 'react';

type Props = {
  type: HeroUIType;
};

export const CharacterPaperdollButton = (props: Props) => {
  const icon: Record<HeroUIType, string> = {
    CHARACTER: imageConfig.icon.ARMOR.HELMET,
  };
  const { setUiType, uiType } = useHeroUIStore();
  const state = useHero((data) => data?.state);
  return (
    <Button
      onClick={() => {
        startTransition(() => {
          setUiType(props.type);
        });
      }}
      size="icon"
      disabled={state !== 'IDLE'}
      variant={uiType === props.type ? 'default' : 'outline'}
    >
      <GameIcon image={icon[props.type]} />
    </Button>
  );
};
