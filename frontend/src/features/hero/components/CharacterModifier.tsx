import { ShieldIcon } from '@/components/game-icons/ShieldIcon';
import { StaffIcon } from '@/components/game-icons/StaffIcon';
import { Separator } from '@/components/ui/separator';
import { Modifier } from '@/shared/types';
import { memo } from 'react';

type Props = Modifier;

export const CharacterModifier = memo((props: Props) => {
  return (
    <>
      <h2 className="text-center text-xl font-semibold">Modifier</h2>
      <Separator />
      <div className="text-muted-foreground">
        <div className="flex items-center gap-1">
          <ShieldIcon />
          {/* <ArmorIcon /> */}
          <p className="text-stone-600">DEF</p>
        </div>
        <p>
          <span>armor:</span> {props.armor}
        </p>
        <p>
          <span>evasion:</span> {props.evasion}
        </p>
        <p>
          <span>magic resistance:</span> {props.magicResistance}
        </p>
      </div>
      <Separator />
      <div className="text-muted-foreground">
        <p className="mb-1 text-amber-300">PHYS</p>
        <p>
          <span>damage:</span> {props.minDamage} - {props.maxDamage}
        </p>
        <p>
          <span>phys damage:</span> {props.physDamage}
        </p>
        <p>
          <span>phys hit rating:</span> {props.physHitRating}
        </p>
        <p>
          <span>phys crit rating:</span> {props.physCritRating}
        </p>
        <p>
          <span>phys crit damage:</span> {props.physCritDamage}
        </p>
      </div>
      <Separator />
      <div className="text-muted-foreground">
        <div className="flex items-center">
          <StaffIcon />

          <p className="text-blue-400">MAGIC</p>
        </div>

        <p>
          <span>spell damage:</span> {props.spellDamage}
        </p>
        <p>
          <span>spell hit rating:</span> {props.spellHitRating}
        </p>
        <p>
          <span>spell crit rating</span> {props.spellCritRating}
        </p>
        <p>
          <span>spell crit damage</span> {props.spellCritDamage}
        </p>
      </div>
    </>
  );
})
