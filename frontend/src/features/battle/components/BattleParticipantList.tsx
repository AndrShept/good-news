import { GameIcon } from '@/components/GameIcon';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { BattleAction, BattleParticipantDto } from '@/shared/types';

interface Props {
  attackers: BattleParticipantDto[] | undefined;
  defenders: BattleParticipantDto[] | undefined;
  selfParticipant: BattleParticipantDto;
  pendingActions: BattleAction[];
}

export const BattleParticipantList = ({ attackers, defenders, selfParticipant, pendingActions }: Props) => {
  return (
    <div className="mt-auto flex gap-1">
      <ul className="text-muted-foreground">
        {attackers?.map((p) => {
          const isTarget = p.id === selfParticipant.targetId;
          const isSelfParticipant = p.id === selfParticipant.id;
          const hasAttackedMe = pendingActions.some((a) => a.participantId === p.id && a.targetId === selfParticipant.id);
          return (
            <li
              key={p.id}
              className={cn('flex items-center', {
                'text-orange-400': isTarget && !p.isDead,
                'text-blue-300': isSelfParticipant && !p.isDead,
                'text-muted': p.isDead,
                underline: hasAttackedMe,
              })}
            >
              {p.isDead && <GameIcon image={imageConfig.icon.ui.battle.dead} />}
              <span
                className={cn('mr-1', {
                  'text-orange-400': isTarget && !p.isDead,
                  'text-blue-300': isSelfParticipant && !p.isDead,
                })}
              >
                {p.name}
              </span>
              <span className="text-foreground text-sm">
                [{p.currentHealth}/{p.maxHealth}]
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-foreground">vs</p>
      <ul className="text-muted-foreground">
        {defenders?.map((p) => {
          const isTarget = p.id === selfParticipant.targetId;
          const isSelfParticipant = p.id === selfParticipant.id;
          const hasAttackedMe = pendingActions.some((a) => a.participantId === p.id && a.targetId === selfParticipant.id);
          return (
            <li
              key={p.id}
              className={cn('flex items-center', {
                'text-orange-400': isTarget && !p.isDead,
                'text-blue-300': isSelfParticipant && !p.isDead,
                'text-muted': p.isDead,
                underline: hasAttackedMe,
              })}
            >
              {p.isDead && <GameIcon image={imageConfig.icon.ui.battle.dead} />}
              <span
                className={cn('mr-1', {
                  'text-orange-400': isTarget && !p.isDead,
                  'text-blue-300': isSelfParticipant && !p.isDead,
                })}
              >
                {p.name}
              </span>
              <span className="text-foreground text-sm">
                [{p.currentHealth}/{p.maxHealth}]
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
