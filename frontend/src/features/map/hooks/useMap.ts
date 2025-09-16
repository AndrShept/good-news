import { ApiMapResponse } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

import { getMapOptions } from '../api/get-map';

type TUseMap<T = ApiMapResponse> = {
  mapId: string;
  select?: (data: ApiMapResponse | undefined) => T;
};

export const useMap = <T = ApiMapResponse | undefined>({ mapId, select }: TUseMap<T>): T | undefined => {
  const { data: map } = useQuery({ ...getMapOptions(mapId), staleTime: Infinity, select });

  return map;
};
