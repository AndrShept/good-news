import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { imageConfig } from '@/shared/config/image-config';
import { StateType } from '@/shared/types';
import { useTransition } from 'react';

import { useHero } from '../hooks/useHero';
import { useHeroStateMutation } from '../hooks/useHeroStateMutation';

type Props = {
  type: StateType;
};

export const CharacterPaperdollButton = ({ type }: Props) => {
  const icon: Record<StateType, string> = {
    CHARACTER: imageConfig.icon.ARMOR.HELMET,
    IDLE: '',
    BATTLE: '',
    CRAFT: '',
    WALK: '',
  };
  const { state } = useHero((data) => ({
    state: data?.state,
  }));
  const [isPending, startTransition] = useTransition();
  const { mutate } = useHeroStateMutation();

  return (
    <Button
      onClick={() => {
        startTransition(() => {
          mutate(type);
        });
      }}
      size="icon"
      disabled={isPending || (state !== 'IDLE' && state !== 'CHARACTER')}
      variant={state === type ? 'default' : 'outline'}
    >
      <GameIcon image={icon[type]} />
    </Button>
  );
};
