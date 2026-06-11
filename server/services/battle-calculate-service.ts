import type { BattleZoneType, DamageType, SelectedDefenseZone } from '@/shared/battle-types';
import type { ItemInstance, Modifier, WeaponAttackHand } from '@/shared/types';

import { clamp } from '../lib/utils';
import { itemTemplateService } from './item-template-service';

interface IsDodgedParam {
  attackerModifier: Modifier;
  targetModifier: Modifier;
  damageType: DamageType;
}

interface CalculatePhysicalDamageParam {
  attackerModifier: Modifier;
  targetModifier: Modifier;
  isCritical: boolean;
  equipments: ItemInstance[];
  hitHand: WeaponAttackHand;
}
interface IsCriticalHitParam {
  attackerModifier: Modifier;
  targetModifier: Modifier;
  damageType: DamageType;
}

export const battleCalculateService = {
  isDodged({ attackerModifier, targetModifier, damageType }: IsDodgedParam) {
    const hitRating = damageType === 'PHYSICAL' ? attackerModifier.physHitRating : attackerModifier.spellHitRating;

    const hitChance = clamp(75 + hitRating * 0.1 + attackerModifier.dexterity * 0.2, 75, 95);

    const evasionChance = clamp(5 + targetModifier.evasion * 0.15 + targetModifier.dexterity * 0.3, 5, 40);

    const missChance = clamp(evasionChance - (hitChance - 75), 0, 40);

    return Math.random() * 100 < missChance;
  },
  isCriticalHit({ attackerModifier, targetModifier, damageType }: IsCriticalHitParam) {
    if (damageType === 'PHYSICAL') {
      // luck * 0.15% + strength * 0.5% + physCritRating * 0.1%
      const critChance = clamp(
        5 + attackerModifier.luck * 0.15 + attackerModifier.strength * 0.05 + attackerModifier.physCritRating * 0.1,
        5,
        50,
      );

      // constitution захисника зменшує шанс крита
      const critReduction = clamp(targetModifier.constitution * 0.1, 0, 20);
      console.log('critChance', critChance);

      return Math.random() * 100 < critChance - critReduction;
    }

    // MAGIC — intelligence * 0.15% + spellCritRating * 0.1%
    const critChance = clamp(5 + attackerModifier.intelligence * 0.15 + attackerModifier.spellCritRating * 0.1, 5, 50);

    // wisdom захисника зменшує шанс крита
    const critReduction = clamp(targetModifier.wisdom * 0.1, 0, 20);
    return Math.random() * 100 < critChance - critReduction;
  },
  isZoneBlocked(attackZone: BattleZoneType, defendZone: SelectedDefenseZone | null) {
    if (!attackZone || !defendZone) return false;
    if (Array.isArray(defendZone)) {
      return (defendZone as BattleZoneType[]).includes(attackZone);
    }
    return attackZone === defendZone;
  },
  calculatePhysicalDamage({ attackerModifier, targetModifier, isCritical, equipments, hitHand }: CalculatePhysicalDamageParam) {
    let baseDamage = 0;
    const equipWeapon = equipments.find((e) => e.slot === hitHand);
    if (equipWeapon) {
      const weaponTemplate = itemTemplateService.getTemplateByItemTemplateId(equipWeapon.itemTemplateId);
      const weaponBase =
        (weaponTemplate.minDamage ?? 0) + Math.random() * ((weaponTemplate.maxDamage ?? 0) - (weaponTemplate.minDamage ?? 0));

      baseDamage = weaponBase + Math.floor(attackerModifier.strength * 0.1);
    }

    if (!equipWeapon) {
      // нема зброї — рукопашний бій
      const wrestlingBase = 2 + Math.floor(attackerModifier.strength * 0.12);
      baseDamage = wrestlingBase + Math.random() * wrestlingBase;
    }

    // physDamage додає % до базового дамагу
    const withPhysDamage = baseDamage * (1 + attackerModifier.physDamage / 100);

    // penetration зменшує ефективний armor
    const effectiveArmor = Math.max(0, targetModifier.armor - attackerModifier.physPenetration);

    // armor редукція максимум 70%
    const reductionPercent = clamp(effectiveArmor * 0.1, 0, 70);
    const afterArmor = withPhysDamage * (1 - reductionPercent / 100);

    // крит множник — базово 150% + physCritDamage бонус
    const critMultiplier = isCritical ? (150 + attackerModifier.physCritDamage) / 100 : 1;

    return Math.round(afterArmor * critMultiplier);
  },
  calculateMagicDamage() {},
};
