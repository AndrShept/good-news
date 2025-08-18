import { client } from '@/lib/utils';
import { BuildingType, LocationType, WorldObjectName } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useHeroChange } from './useHeroChange';
import { useHeroId } from './useHeroId';

export const useLocationChange = () => {
  const { heroChange } = useHeroChange();
  const id = useHeroId();

  return useMutation({
    mutationFn: ({ buildingType, type, name }: { buildingType: BuildingType; type: LocationType; name: WorldObjectName }) =>
      client.hero[':id'].location.change.$put({
        param: {
          id,
        },
        json: {
          buildingType,
          type,
          name
        },
      }),
    onSuccess: (_, { buildingType, type, name }) => {
      heroChange({
        location: {
          buildingType,
          type,
          name ,
        },
      });
    },
  });
};
