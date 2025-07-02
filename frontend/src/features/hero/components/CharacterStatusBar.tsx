import { HeroAvatar } from '@/components/HeroAvatar';
import { memo } from 'react';

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

export const CharacterStatusBar = memo(({ avatarImage, currentHealth, currentMana, maxHealth, maxMana, name, level, id }: Props) => {
  console.log('render CharacterStatusBar');
  return (
    <div className="flex w-full items-center gap-2">
      <div>
        <HeroAvatar src={avatarImage} />
      </div>
      <div className="flex w-full flex-col gap-0.5">
        <div>
          <span className="mr-1">{name}</span>
          <span className="text-muted-foreground">lvl:{level}</span>
        </div>

        <FillBar value={currentHealth} type="health" maxValue={maxHealth} />
        <FillBar value={currentMana} type="mana" maxValue={maxMana} />
        <BuffList id={id} />
      </div>
    </div>
  );
});
