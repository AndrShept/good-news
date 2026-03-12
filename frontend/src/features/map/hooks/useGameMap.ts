import { useQuery } from '@tanstack/react-query';

import { getMapOptions } from '../api/get-map';

type TUseGameMap = {
  mapId: string;
  chunkId: string
};

export const useGameMap = ({ mapId , chunkId }: TUseGameMap) => {
  const { data, isLoading } = useQuery({ ...getMapOptions(mapId, chunkId) });

  return { data, isLoading };
};
