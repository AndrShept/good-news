import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { getMapOptions } from '../api/get-map';

export const Map = () => {
  const { data, isLoading, isError, error } = useQuery(getMapOptions('SOLMERE'));

  if (isLoading) return <p>LOADING MAP...</p>;
  if (isError) return <p>{error.message}</p>;
  return <div>Map</div>;
};
