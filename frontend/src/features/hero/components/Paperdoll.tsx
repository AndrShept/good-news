import { Hero } from '@/shared/types';

import { CharacterStatusBar } from './CharacterStatusBar';
import { Equipments } from './Equipment';
import { FillBar } from './FillBar';

interface Props {
  hero: Hero;
}

export const Paperdoll = ({ hero }: Props) => {
  return (
    <section className="flex h-fit shrink-0 flex-col gap-6 p-6">
      <CharacterStatusBar
        avatarUrl={hero.avatarImage}
        health={hero.currentHealth}
        maxHealth={hero.maxHealth}
        mana={hero.currentMana}
        maxMana={hero.maxMana}
        name={hero.name}
        level={hero.level}
        // buffs={hero.buffs}
      />

      <Equipments equipments={hero.equipments} />

      <div className="mt-auto">
        <FillBar maxValue={hero.maxExperience} value={hero.currentExperience} color="violet" />
      </div>
    </section>
  );
};
