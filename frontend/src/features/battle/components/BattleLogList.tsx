import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { cn, getTimeFns } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';

import { useBattle } from '../hooks/useBattle';

export const BattleLogList = () => {
  const { battle } = useBattle();
  const ref = useRef<null | HTMLUListElement>(null);
  const heroId = useHeroId();
  useEffect(() => {
    ref.current?.lastElementChild?.scrollIntoView({
      block: 'nearest',
    });
  }, [battle?.logs]);
  return (
    <ul ref={ref} className="flex flex-col pl-1 pt-1">
      {battle?.logs.map((log) => {
        const isAttacker = log.attackerId === heroId;
        const isDefender = log.defenderId === heroId;
        const defZone = Array.isArray(log.defendZone) ? log.defendZone.join('/') : log.defendZone;
        return (
          <div
            key={log.id}
            className={cn('flex w-fit items-start gap-1.5 rounded-md border-l-2 px-2 py-1 text-[13px]', {
              'border-emerald-500 bg-emerald-500/10': isAttacker,
              'border-orange-500 bg-orange-500/10': isDefender,
              'border-transparent': !isAttacker && !isDefender,
            })}
          >
            <time className="text-muted-foreground min-w-[42px] pt-px text-[11px]">[{getTimeFns(log.createdAt)}]</time>
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium">{log.attackerName}</span>
              <span className="text-muted-foreground text-[11px]">[{log.hand === 'LEFT_HAND' ? 'L' : 'R'}]</span>
              <span className="bg-secondary rounded px-1 py-px text-[11px]">{log.attackingZone ?? '—'}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{log.defenderName}</span>
              <span className="bg-secondary rounded px-1 py-px text-[11px]">{defZone}</span>

              {log.isMissed && <span className="bg-muted rounded px-1.5 py-px text-[11px] font-medium">dodged</span>}
              {log.isBlocking && <span className="rounded bg-blue-700 px-1.5 py-px text-[11px] font-medium text-blue-200">blocked</span>}
              {!log.isMissed && !log.isBlocking && (
                <>
                  {log.isCriticalDamage ? (
                    <span className="rounded bg-amber-100 px-1.5 py-px text-[11px] font-medium text-amber-700">crit</span>
                  ) : (
                    <span className="rounded bg-amber-800 px-1.5 py-px text-[11px] font-medium text-amber-200">hit</span>
                  )}
                  <span className={cn('font-medium', log.isCriticalDamage ? 'text-red-600' : 'text-amber-200')}>−{log.giveDamage}</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </ul>
  );
};
