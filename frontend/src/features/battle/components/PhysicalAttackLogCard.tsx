import { cn, getTimeFns } from '@/lib/utils';
import { memo } from 'react';
import { BattleLogIcon } from './BattleLogIcon';
import { imageConfig } from '@/shared/config/image-config';
import { GameIcon } from '@/components/GameIcon';
import { PhysicalAttackLog } from '@/shared/battle-types';

interface Props {
  log: PhysicalAttackLog;
  heroId: string;
}
export const PhysicalAttackLogCard = memo(({ log, heroId }: Props) => {
  const defZone = Array.isArray(log.defendZone) ? log.defendZone.join('/') : log.defendZone;
  const hand = log.hand === 'LEFT_HAND' ? 'L' : 'R';
  const isHero = log.attackerId === heroId;
  const isLowHealth = log.targetHealthAfterHit <= log.targetHealthAfterHit * 0.3;
  return (
    <li className="inline-flex flex-wrap items-center gap-1 leading-relaxed text-[#8b949e]">
      <span className="text-zinc-600">[{getTimeFns(log.createdAt)}] </span>
      <span className={isHero ? 'text-blue-300' : 'text-orange-400'}>{log.attackerName}</span>
      <span> [{hand} → </span>
      <span className="text-emerald-300">{log.attackingZone ?? '—'}</span>
      <span>] vs </span>
      <span className={!isHero ? 'text-blue-300' : 'text-orange-400'}>{log.targetName}</span>
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
          <span
            className={cn('ml-1 text-[15px] text-orange-200', {
              'font-semibold text-red-500': log.isCriticalDamage,
            })}
          >
            -{log.giveDamage}
          </span>
          <div className="ml-1 inline-flex items-center">
            [<span className={cn(isLowHealth ? 'text-red-500' : 'text-foreground')}>{log.targetHealthAfterHit}</span>
            <span>/</span>
            <span className="text-muted-foreground">{log.targetMaxHealth}</span>]
            {log.targetHealthAfterHit <= 0 && <GameIcon className="ml-0.5 size-6" image={imageConfig.icon.ui.battle.dead} />}
          </div>
        </>
      )}
    </li>
  );
});
