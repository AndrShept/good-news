import { HeroAvatar } from '@/components/HeroAvatar';
import { BuffList } from './BuffList';
import { FillBar } from './FillBar';

interface Props {
  avatarUrl: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  name: string;
  level: number;
  id: string;
}

export const CharacterStatusBar = ({ avatarUrl, health, mana, maxHealth, maxMana, name, level, id }: Props) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div>
        <HeroAvatar src={avatarUrl} />
      </div>
      <div className="flex w-full flex-col gap-0.5">
        <div>
          <span className="mr-1">{name}</span>
          <span className="text-muted-foreground">lvl:{level}</span>
        </div>

        <FillBar value={health} color="green" maxValue={maxHealth} />
        <FillBar value={mana} color="blue" maxValue={maxMana} />
        <BuffList id={id} />
      </div>
    </div>
  );
};
