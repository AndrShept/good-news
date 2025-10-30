import { HeroIcon } from '@/components/game-icons/HeroIcon';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

import { useHero } from '../hooks/useHero';
import { useHeroStateMutation } from '../hooks/useHeroStateMutation';

export const CharacterPaperdollButton = () => {
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
          mutate('CHARACTER');
        });
      }}
      size="icon"
      disabled={isPending || action !== 'IDLE'}
      variant={state === 'CHARACTER' ? 'default' : 'outline'}
    >
      <HeroIcon />
    </Button>
  );
};
