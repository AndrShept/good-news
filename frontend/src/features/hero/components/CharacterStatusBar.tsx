import { HeroAvatar } from '@/components/HeroAvatar';
import { memo, useEffect } from 'react';

import { BuffList } from './BuffList';
import { FillBar } from './FillBar';

interface Props {
  avatarImage: string;
  currentHealth: number;
  maxHealth: number;
  currentMana: number;
  maxMana: number;
  name: string;
  level: number;
  id: string;
}

export const CharacterStatusBar = memo((props: Props) => {
  return (
    <div className="flex w-full items-center gap-2">
      <div>
        <HeroAvatar src={props.avatarImage} />
      </div>
      <div className="flex w-full flex-col gap-0.5">
        <div>
          <span className="mr-1">{props.name}</span>
          <span className="text-muted-foreground">lvl:{props.level}</span>
        </div>

        <FillBar value={props.currentHealth} type="health" maxValue={props.maxHealth} />
        <FillBar value={props.currentMana} type="mana" maxValue={props.maxMana} />
        <BuffList id={props.id} />
      </div>
    </div>
  );
});
