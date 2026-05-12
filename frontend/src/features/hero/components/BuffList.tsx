import { BuffInstance } from '@/shared/types';

import { useGameData } from '../hooks/useGameData';
import { BuffCard } from './BuffCard';

interface Props {
  buffs: BuffInstance[];
}

export const BuffList = ({ buffs }: Props) => {
  const { buffTemplateById } = useGameData();
  return (
    <ul className="flex flex-wrap gap-1">
      {buffs?.map((buff) => <BuffCard key={buff.id} {...buff} buffTemplate={buffTemplateById[buff.buffTemplateId]} />)}
    </ul>
  );
};
