import { ShieldIcon } from '@/components/game-icons/ShieldIcon';
import { StaffIcon } from '@/components/game-icons/StaffIcon';
import { Separator } from '@/components/ui/separator';
import { Modifier } from '@/shared/types';

type Props = Modifier;

export const CharacterModifier = (props: Props) => {
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
          <span>defense:</span> {props.defense}
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
          <span>phys hit chance:</span> {props.physHitChance}
        </p>
        <p>
          <span>phys crit chance:</span> {props.physCritChance}
        </p>
        <p>
          <span>phys crit power:</span> {props.physCritPower}
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
          <span>spell hit chance:</span> {props.spellHitChance}
        </p>
        <p>
          <span>spell crit chance</span> {props.spellCritChance}
        </p>
        <p>
          <span>spell crit power</span> {props.spellCritPower}
        </p>
      </div>
    </>
  );
};
