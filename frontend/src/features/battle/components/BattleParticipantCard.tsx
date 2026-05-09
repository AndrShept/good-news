import { CharacterStatusBar } from '@/features/hero/components/CharacterStatusBar';
import { Equipments } from '@/features/hero/components/Equipment';
import { BattleParticipant } from '@/shared/types';
import React from 'react';

type Props = BattleParticipant;

export const BattleParticipantCard = (props: Props) => {
  const avatarImage = props.type === 'HERO' ? props.avatarImage : undefined;
  const level = props.type === 'HERO' ? props.level : undefined;
  return (
    <div className="flex flex-col gap-2">
      <CharacterStatusBar
        avatarImage={avatarImage}
        id={props.id}
        name={props.name}
        currentHealth={props.currentHealth}
        currentMana={props.currentMana}
        maxHealth={props.maxHealth}
        maxMana={props.maxMana}
        level={level}
      />
      <Equipments scale={props.scale} characterImage={props.characterImage} equipments={props.equipments} />
    </div>
  );
};
