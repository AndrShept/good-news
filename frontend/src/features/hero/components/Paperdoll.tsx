import { Equipment } from '@/shared/types';
import { memo } from 'react';

import { CharacterStatusBar } from './CharacterStatusBar';
import { Equipments } from './Equipment';
import { FillBar } from './FillBar';

interface Props {
  avatarImage: string;
  characterImage: string
  currentHealth: number;
  maxHealth: number;
  currentMana: number;
  maxMana: number;
  name: string;
  level: number;
  id: string;
  maxExperience: number;
  currentExperience: number;
  equipments: Equipment[];
}

export const Paperdoll = memo(
  ({
    avatarImage,
    characterImage,
    currentExperience,
    equipments,
    currentHealth,
    id,
    level,
    currentMana,
    maxExperience,
    maxHealth,
    maxMana,
    name,
  }: Props) => {
    return (
      <section className="flex h-fit w-[300px] shrink-0 flex-col gap-6 p-3">
        <CharacterStatusBar
          avatarImage={avatarImage}
          currentHealth={currentHealth}
          maxHealth={maxHealth}
          currentMana={currentMana}
          maxMana={maxMana}
          name={name}
          level={level}
          id={id}
        />

        <Equipments characterImage={characterImage} equipments={equipments} />

        <div className="mt-auto">
          <FillBar maxValue={maxExperience} value={currentExperience} type="exp" />
        </div>
      </section>
    );
  },
);
