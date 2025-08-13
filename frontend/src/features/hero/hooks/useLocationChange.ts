import { client } from '@/lib/utils';
import { BuildingType, LocationType } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useHeroChange } from './useHeroChange';
import { useHeroId } from './useHeroId';

export const useLocationChange = () => {
  const { heroChange } = useHeroChange();
  const id = useHeroId();

  return useMutation({
    mutationFn: ({ buildingType, type }: { buildingType: BuildingType; type: LocationType }) =>
      client.hero[':id'].location.change.$put({
        param: {
          id,
        },
        json: {
          buildingType ,
          type,
        },
      }),
    onSuccess: (_, { buildingType, type }) => {
      heroChange({
        location: {
          buildingType,
          type,
        },
      });
    },
  });
};
