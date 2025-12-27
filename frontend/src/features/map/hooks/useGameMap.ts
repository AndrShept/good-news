import { useQuery } from '@tanstack/react-query';

import { getMapOptions } from '../api/get-map';

type TUseGameMap = {
  mapId: string;
};

export const useGameMap = ({ mapId }: TUseGameMap) => {
  const { data, isLoading } = useQuery({ ...getMapOptions(mapId) });

  return { data, isLoading };
};
