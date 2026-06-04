import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useEffect, useRef } from 'react';

import { useBattle } from '../hooks/useBattle';
import { AbilityLogCard } from './AbilityLogCard';
import { PhysicalAttackLogCard } from './PhysicalAttackLogCard';

export const BattleLogList = () => {
  const { battle } = useBattle();
  const ref = useRef<HTMLUListElement>(null);
  const heroId = useHeroId();

  useEffect(() => {
    ref.current?.lastElementChild?.scrollIntoView({ block: 'nearest' });
  }, [battle?.logs]);

  return (
    <ul ref={ref} className="flex flex-col gap-1 font-mono text-[13px]">
      {battle?.logs.map((log) => {
        if (log.type === 'PHYSICAL_ATTACK') return <PhysicalAttackLogCard key={log.id} log={log} heroId={heroId} />;
        if (log.type === 'ABILITY') return <AbilityLogCard key={log.id} log={log} />;
      })}
    </ul>
  );
};
