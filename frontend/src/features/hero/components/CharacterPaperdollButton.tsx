import { HeroIcon } from '@/components/game-icons/HeroIcon';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

import { useHero } from '../hooks/useHero';
import { useHeroStateMutation } from '../hooks/useHeroStateMutation';

export const CharacterPaperdollButton = () => {
  const { action, state } = useHero((state) => ({
    action: state?.data?.action,
    state: state?.data?.state,
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
      disabled={isPending || action?.type !== 'IDLE'}
      variant={state?.type === 'CHARACTER' ? 'default' : 'outline'}
    >
      <HeroIcon />
    </Button>
  );
};
