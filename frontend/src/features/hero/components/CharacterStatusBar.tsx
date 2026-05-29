import { GameAvatar } from '@/components/GameAvatar';
import { BattleParticipantModifierInfo } from '@/features/battle/components/BattleParticipantModifierInfo';
import { BuffInstance, Modifier } from '@/shared/types';

import { BuffList } from './BuffList';
import { FillBar } from './FillBar';

interface Props {
  avatarImage?: string;
  currentHealth: number;
  maxHealth: number;
  currentMana: number;
  maxMana: number;
  name: string;
  level?: number;
  id: string;
  buffs: BuffInstance[];
  modifier?: Modifier;
}

export const CharacterStatusBar = (props: Props) => {
  return (
    <div className="flex w-full items-center gap-2">
      {props.avatarImage && (
        <div>
          <GameAvatar src={props.avatarImage} />
        </div>
      )}
      <div className="flex w-full flex-col gap-0.5">
        <div className="flex gap-1">
          <span className="mr-1">{props.name}</span>
          {props.level && <span className="text-muted-foreground">lvl:{props.level}</span>}
          {props.modifier && <BattleParticipantModifierInfo modifier={props.modifier} />}
        </div>

        <FillBar value={props.currentHealth} type="health" maxValue={props.maxHealth} />
        <FillBar value={props.currentMana} type="mana" maxValue={props.maxMana} />
        <BuffList buffs={props.buffs} />
      </div>
    </div>
  );
};
