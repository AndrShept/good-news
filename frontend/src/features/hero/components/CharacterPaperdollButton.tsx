import { GameIcon } from '@/components/GameIcon';
import { HeroIcon } from '@/components/game-icons/HeroIcon';
import { Button } from '@/components/ui/button';
import { imageConfig } from '@/shared/config/image-config';
import { StateType } from '@/shared/types';
import { JSX, useTransition } from 'react';

import { useHero } from '../hooks/useHero';
import { useHeroStateMutation } from '../hooks/useHeroStateMutation';

type Props = {
  type: StateType;
};

export const CharacterPaperdollButton = ({ type }: Props) => {
  const icon: Record<StateType, string> = {
    CHARACTER: imageConfig.icon.ARMOR.HELMET,
    SKILLS: imageConfig.icon.ui.book,
    IDLE: '',
  };
  const { action, state } = useHero((state) => ({
    action: state?.data?.action?.type,
    state: state?.data?.state?.type,
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
      disabled={isPending || action !== 'IDLE'}
      variant={state === type ? 'default' : 'outline'}
    >
      <GameIcon image={icon[type]} />
    </Button>
  );
};
