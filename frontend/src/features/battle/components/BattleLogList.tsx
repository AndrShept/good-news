import { GameIcon } from '@/components/GameIcon';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getTimeFns } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { BattleLog, HandResult } from '@/shared/types';
import { memo, useEffect, useRef } from 'react';

import { useBattle } from '../hooks/useBattle';
import { BattleLogIcon } from './BattleLogIcon';

export const BattleLogList = () => {
  const { battle } = useBattle();
  const ref = useRef<HTMLUListElement>(null);
  const heroId = useHeroId();

  useEffect(() => {
    ref.current?.lastElementChild?.scrollIntoView({ block: 'nearest' });
  }, [battle?.logs]);

  return (
    <ul ref={ref} className="flex flex-col gap-1 font-mono text-[13px]">
      {battle?.logs.map((log) => <BattleLogCard key={log.id} log={log} heroId={heroId} />)}
    </ul>
  );
};

const BattleLogCard = memo(({ log, heroId }: { log: BattleLog; heroId: string }) => {
  const defZone = Array.isArray(log.defendZone) ? log.defendZone.join('/') : log.defendZone;
  const hand = log.hand === 'LEFT_HAND' ? 'L' : 'R';
  const isHero = log.attackerId === heroId;

  return (
    <li className="inline-flex flex-wrap items-center gap-1 leading-relaxed text-[#8b949e]">
      <span className="text-zinc-600">[{getTimeFns(log.createdAt)}] </span>
      <span className={isHero ? 'text-blue-300' : 'text-orange-400'}>{log.attackerName}</span>
      <span> [{hand} → </span>
      <span className="text-emerald-300">{log.attackingZone ?? '—'}</span>
      <span>] vs </span>
      <span className={!isHero ? 'text-blue-300' : 'text-orange-400'}>{log.defenderName}</span>
      <span> [{defZone}] — </span>
      {log.isMissed && <BattleLogIcon image={imageConfig.icon.ui.battle.miss} label="MISS" className="text-yellow-300" />}
      {log.isBlocking && <BattleLogIcon className="text-blue-400" image={imageConfig.icon.ui.battle.block} label="BLOCK" />}
      {!log.isMissed && !log.isBlocking && (
        <>
          {log.isCriticalDamage ? (
            <BattleLogIcon className="text-red-500" image={imageConfig.icon.ui.battle.phys_crit} label="CRIT" />
          ) : (
            <BattleLogIcon className="text-green-500" image={imageConfig.icon.ui.battle.hit} label="HIT" />
          )}
          <span className="ml-1 text-sm text-orange-100">-{log.giveDamage}</span>
        </>
      )}
    </li>
  );
});
