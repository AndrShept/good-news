import type { BattleZoneType, DamageType, HandResult, Modifier, SelectedAttackingZone, SelectedDefenseZone } from '@/shared/types';

import { clamp } from '../lib/utils';

interface IsDodgedParam {
  attackerModifier: Modifier;
  defenderModifier: Modifier;
  damageType: DamageType;
}

export const battleCalculateService = {
  isDodged({ attackerModifier, defenderModifier, damageType }: IsDodgedParam) {
    const hitRating = damageType === 'PHYSICAL' ? attackerModifier.physHitRating : attackerModifier.spellHitRating;

    const hitChance = clamp(75 + hitRating * 0.1 + attackerModifier.dexterity * 0.2, 75, 95);

    const evasionChance = clamp(5 + defenderModifier.evasion * 0.15 + defenderModifier.dexterity * 0.3, 5, 40);

    const missChance = clamp(evasionChance - (hitChance - 75), 0, 40);

    return Math.random() * 100 < missChance;
  },
  isCriticalHit(attackerModifier: Modifier, defenderModifier: Modifier, damageType: DamageType) {
    if (damageType === 'PHYSICAL') {
      // strength * 0.1% + dexterity * 0.15% + physCritRating * 0.1%
      const critChance = clamp(
        5 + attackerModifier.strength * 0.1 + attackerModifier.dexterity * 0.15 + attackerModifier.physCritRating * 0.1,
        5,
        50,
      );

      // constitution захисника зменшує шанс крита
      const critReduction = clamp(defenderModifier.constitution * 0.1, 0, 20);

      return Math.random() * 100 < critChance - critReduction;
    }

    // MAGIC — intelligence * 0.15% + spellCritRating * 0.1%
    const critChance = clamp(5 + attackerModifier.intelligence * 0.15 + attackerModifier.spellCritRating * 0.1, 5, 50);

    // wisdom захисника зменшує шанс крита
    const critReduction = clamp(defenderModifier.wisdom * 0.1, 0, 20);

    return Math.random() * 100 < critChance - critReduction;
  },
  checkZoneBlocked(attackZone: BattleZoneType, defendZone: SelectedDefenseZone): HandResult {
    if (Array.isArray(defendZone)) {
      return (defendZone as BattleZoneType[]).includes(attackZone) ? 'BLOCKED' : 'HIT';
    }
    return attackZone === defendZone ? 'BLOCKED' : 'HIT';
  },
  calculatePhysicalDamage(attackerModifier: Modifier, defenderModifier: Modifier, isCritical: boolean) {
    // базовий дамаг між min і max
    const baseDamage = attackerModifier.minDamage + Math.random() * (attackerModifier.maxDamage - attackerModifier.minDamage);

    // physDamage додає % до базового дамагу
    const withPhysDamage = baseDamage * (1 + attackerModifier.physDamage / 100);

    // penetration зменшує ефективний armor
    const effectiveArmor = Math.max(0, defenderModifier.armor - attackerModifier.physPenetration);

    // armor редукція максимум 70%
    const reductionPercent = clamp(effectiveArmor * 0.1, 0, 70);
    const afterArmor = withPhysDamage * (1 - reductionPercent / 100);

    // крит множник — базово 150% + physCritDamage бонус
    const critMultiplier = isCritical ? (150 + attackerModifier.physCritDamage) / 100 : 1;

    return Math.round(afterArmor * critMultiplier);
  },
  calculateMagicDamage() {},
};
