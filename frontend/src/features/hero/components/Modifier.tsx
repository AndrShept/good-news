import { ShieldIcon } from '@/components/game-icons/ShieldIcon';
import { StaffIcon } from '@/components/game-icons/StaffIcon';
import { Separator } from '@/components/ui/separator';
import { useHero } from '@/features/hero/hooks/useHero';
import { IHeroStat, Modifier } from '@/shared/types';
import { memo, useEffect, useRef, useState } from 'react';

import { Stats } from './Stats';

const sumStats = (stat: IHeroStat, modifier: Modifier) => {
  const sumStats = {} as IHeroStat;
  for (const key in stat) {
    const typedKey = key as keyof IHeroStat;

    sumStats[typedKey] = stat[typedKey] + modifier[typedKey];
  }
  return sumStats;
};
export const Modifiers = memo(() => {
  const {
    freeStatPoints,
    modifier,
    stat: heroStat,
  } = useHero((state) => ({
    modifier: state?.data?.modifier,
    freeStatPoints: state?.data?.freeStatPoints ?? 0,
    stat: state?.data?.stat,
  }));

  if (!modifier) throw new Error('modifier not found');
  if (!heroStat) throw new Error('stat not found');
  const initialHeroStats = {
    strength: 0,
    constitution: 0,
    dexterity: 0,
    intelligence: 0,
    luck: 0,
  };
  const [stats, setStats] = useState<IHeroStat>(initialHeroStats);
  const baseStats = useRef<IHeroStat>(initialHeroStats);
  const [freePoints, setFreePoints] = useState(freeStatPoints);
  const baseFreePoints = useRef(freeStatPoints);

  // const newStats = sumStats()

  useEffect(() => {
    setStats(heroStat);
    console.log(heroStat);
    baseStats.current = heroStat;
    setFreePoints(freeStatPoints);
    baseFreePoints.current = freeStatPoints;
  }, [freeStatPoints, heroStat, modifier.constitution, modifier.dexterity, modifier.intelligence, modifier.luck, modifier.strength]);
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
          <span>defense:</span> {modifier.defense}
        </p>
        <p>
          <span>evasion:</span> {modifier.evasion}
        </p>
        <p>
          <span>magic resistance:</span> {modifier.magicResistance}
        </p>
      </div>
      <Separator />
      <div className="text-muted-foreground">
        <p className="mb-1 text-amber-300">PHYS</p>
        <p>
          <span>damage:</span> {modifier.minDamage} - {modifier.maxDamage}
        </p>
        <p>
          <span>melee damage:</span> {modifier.physDamage}
        </p>
        <p>
          <span>melee crit chance:</span> {modifier.physCritChance}
        </p>
        <p>
          <span>melee crit power:</span> {modifier.physCritPower}
        </p>
      </div>
      <Separator />
      <div className="text-muted-foreground">
        <div className="flex items-center">
          <StaffIcon />

          <p className="text-blue-400">MAGIC</p>
        </div>

        <p>
          <span>spell damage:</span> {modifier.spellDamage}
        </p>
        <p>
          <span>spell crit chance</span> {modifier.spellCritChance}
        </p>
        <p>
          <span>spell crit power</span> {modifier.spellCritPower}
        </p>
      </div>
    </section>
  );
});
