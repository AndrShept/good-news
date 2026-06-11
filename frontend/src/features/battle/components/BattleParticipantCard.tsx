import { CharacterStatusBar } from '@/features/hero/components/CharacterStatusBar';
import { Equipments } from '@/features/hero/components/Equipment';
import { BattleParticipantDto } from '@/shared/battle-types';
import { sumAllModifier } from '@/shared/utils';
import { memo } from 'react';

type Props = BattleParticipantDto;

export const BattleParticipantCard = memo((props: Props) => {
  const avatarImage = props.type === 'HERO' ? props.avatarImage : undefined;
  const level = props.type === 'HERO' ? props.level : undefined;
  const sumModifier = sumAllModifier(props.stat ?? {}, props.modifier ?? {});
  const giveDamage = props.combatStats.reduce((acc, item) => acc + item.value, 0);
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
        buffs={props.buffs}
        modifier={sumModifier}
      />
      <Equipments scale={props.scale} characterImage={props.characterImage} equipments={props.equipments} />
      <p className="text-mauve-600">
        Total Damage: <span className="text-foreground font-semibold">{giveDamage}</span>
      </p>
    </div>
  );
});
