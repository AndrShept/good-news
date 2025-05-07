import { HeroAvatar } from '@/components/HeroAvatar';

import { FillBar } from './FillBar';

interface Props {
  avatarUrl: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  name: string;
  level: number;
  //   buffs: Buff[];
}

export const HeroStatus = ({
  avatarUrl,
  health,
  mana,
  maxHealth,
  maxMana,
  name,
  level,
  //   buffs,
}: Props) => {
  return (
    <div className="flex items-center gap-2">
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

        {/* <ul className='flex gap-1 flex-wrap'>
          {buffs.map((buff) => (
            <li  key={buff.id}>
              <BuffCard buff={buff} />
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};
