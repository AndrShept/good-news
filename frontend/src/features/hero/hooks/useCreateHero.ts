import { toastError } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

import { createHero } from '../api/create-hero';

export const useCreateHero = () =>
  useMutation({
    mutationFn: createHero,

  });
