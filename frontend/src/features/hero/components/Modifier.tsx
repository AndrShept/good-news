import { ArmorIcon } from '@/components/game-icons/ArmorIcon';
import { ShieldIcon } from '@/components/game-icons/ShieldIcon';
import { StaffIcon } from '@/components/game-icons/StaffIcon';
import { Separator } from '@/components/ui/separator';
import { useHero } from '@/features/hero/hooks/useHero';
import { HeroStats } from '@/shared/types';
import { useEffect, useRef, useState } from 'react';

import { Stats } from './Stats';

export const Modifiers = () => {
  const hero = useHero();
  if (!hero) throw new Error('Hero not found');
  const initialHeroStats = {
    strength: 0,
    constitution: 0,
    dexterity: 0,
    intelligence: 0,
    luck: 0,
  };
  const modifiers = hero.modifier;
  const [stats, setStats] = useState<HeroStats>(initialHeroStats);
  const baseStats = useRef<HeroStats>(initialHeroStats);
  const [freePoints, setFreePoints] = useState(hero.freeStatPoints);
  const baseFreePoints = useRef(hero.freeStatPoints);

  useEffect(() => {
    const newHeroStats = {
      strength: hero.modifier.strength,
      constitution: hero.modifier.constitution,
      dexterity: hero.modifier.dexterity,
      intelligence: hero.modifier.intelligence,
      luck: hero.modifier.luck,
    };

    setStats(newHeroStats);
    baseStats.current = newHeroStats;
    setFreePoints(hero.freeStatPoints);
    baseFreePoints.current = hero.freeStatPoints;
  }, [hero]);
  return (
    <section className="h-fit max-w-fit flex-col gap-2 rounded text-sm md:flex">
      <Stats
        reset={true}
        currentStats={stats}
        setCurrentStats={setStats}
        freePoints={freePoints}
        setFreePoints={setFreePoints}
        baseStats={baseStats.current}
        baseFreePoints={baseFreePoints.current}
      />
      <h2 className="text-center text-xl font-semibold">Modifier</h2>
      <Separator />
      <div className="text-muted-foreground">
        <div className="flex items-center gap-1">
          <ShieldIcon />
          {/* <ArmorIcon /> */}
          <p className="text-stone-600">DEF</p>
        </div>
        <p>
          <span>armor:</span> {modifiers.armor}
        </p>
        <p>
          <span>evasion:</span> {modifiers.evasion}
        </p>
        <p>
          <span>magic resistances:</span> {modifiers.magicResistances}
        </p>
      </div>
      <Separator />
      <div className="text-muted-foreground">
        <p className="mb-1 text-amber-300">PHYS</p>
        <p>
          <span>damage:</span> {modifiers.minDamage} - {modifiers.maxDamage}
        </p>
        <p>
          <span>melee damage:</span> {modifiers.meleeDamage}
        </p>
        <p>
          <span>melee crit chance:</span> {modifiers.meleeDamageCritChance}
        </p>
        <p>
          <span>melee crit power:</span> {modifiers.meleeDamageCritPower}
        </p>
      </div>
      <Separator />
      <div className="text-muted-foreground">
        <div className="flex items-center">
          <StaffIcon />

          <p className="text-blue-400">MAGIC</p>
        </div>

        <p>
          <span>spell damage:</span> {modifiers.spellDamage}
        </p>
        <p>
          <span>spell crit chance</span> {modifiers.spellDamageCritChance}
        </p>
        <p>
          <span>spell crit power</span> {modifiers.spellDamageCritPower}
        </p>
      </div>
    </section>
  );
};
