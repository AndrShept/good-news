import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';

import { getBuffOptions } from '../api/get-buff';
import { useHero } from '../hooks/useHero';
import { BuffCard } from './BuffCard';

export const BuffList = ({ id }: { id: string }) => {
  const { data: buffs } = useSuspenseQuery(getBuffOptions(id));
  return <ul className="flex flex-wrap gap-1">{buffs?.data?.map((buff) => <BuffCard key={buff.id} buff={buff} />)}</ul>;
};
