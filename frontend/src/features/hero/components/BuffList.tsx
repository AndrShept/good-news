import { useSuspenseQuery } from '@tanstack/react-query';

import { getBuffOptions } from '../api/get-buff';
import { useGameData } from '../hooks/useGameData';
import { BuffCard } from './BuffCard';

export const BuffList = ({ id }: { id: string }) => {
  const { data: buffs } = useSuspenseQuery(getBuffOptions(id));
  const { buffTemplateById } = useGameData();
  return (
    <ul className="flex flex-wrap gap-1">
      {buffs?.map((buff) => <BuffCard key={buff.id} {...buff} buffTemplate={buffTemplateById[buff.buffTemplateId]} />)}
    </ul>
  );
};
