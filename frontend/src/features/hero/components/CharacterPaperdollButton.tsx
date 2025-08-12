import { HeroIcon } from '@/components/game-icons/HeroIcon';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

import { useHero } from '../hooks/useHero';
import { useStateChange } from '../hooks/useStateChange';

export const CharacterPaperdollButton = () => {
  const { state, action } = useHero((state) => ({
    state: state?.data?.state,
    action: state?.data?.action,
  }));
  const stateMutation = useStateChange();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      onClick={() => {
        startTransition(() => {
          stateMutation.mutate('CHARACTER');
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
