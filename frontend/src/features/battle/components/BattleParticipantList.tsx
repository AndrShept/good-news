import { GameIcon } from '@/components/GameIcon';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { BattleParticipantDto } from '@/shared/types';

interface Props {
  attackers: BattleParticipantDto[] | undefined;
  defenders: BattleParticipantDto[] | undefined;
  selfParticipant: BattleParticipantDto;
}

export const BattleParticipantList = ({ attackers, defenders, selfParticipant }: Props) => {
  return (
    <div className="mt-auto flex gap-1">
      <ul className="text-muted-foreground">
        {attackers?.map((a) => {
          const isTarget = a.id === selfParticipant.targetId;
          const isSelfParticipant = a.id === selfParticipant.id;

          return (
            <li
              key={a.id}
              className={cn('flex items-center', {
                'text-orange-400': isTarget && !a.isDead,
                'text-blue-300': isSelfParticipant && !a.isDead,
                'text-muted': a.isDead,
              })}
            >
              {a.isDead && <GameIcon image={imageConfig.icon.ui.battle.dead} />}
              <span>{`${a.name} [${a.currentHealth}/${a.maxHealth}]`}</span>
            </li>
          );
        })}
      </ul>
      <p className="text-red-500">vs</p>
      <ul className="text-muted-foreground">
        {defenders?.map((a) => {
          const isTarget = a.id === selfParticipant.targetId;
          const isSelfParticipant = a.id === selfParticipant.id;
          return (
            <li
              key={a.id}
              className={cn('flex items-center', {
                'text-orange-400': isTarget && !a.isDead,
                'text-blue-300': isSelfParticipant && !a.isDead,
                'text-muted': a.isDead,
              })}
            >
              {a.isDead && <GameIcon image={imageConfig.icon.ui.battle.dead} />}
              <span>{`${a.name} [${a.currentHealth}/${a.maxHealth}]`}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
