import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import React from 'react';

import { useCreateGroup } from '../hooks/useCreateGroup';

export const CreateGroupButton = () => {
  const { mutate, isPending } = useCreateGroup();
  const heroId = useHeroId();
  return (
    <Button onClick={() => mutate(heroId)} disabled={isPending} className="rounded-full">
      Create group
    </Button>
  );
};
