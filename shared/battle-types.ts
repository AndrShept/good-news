import { z } from 'zod';

import type { Hero, IHeroStat, Modifier, WeaponAttackHand } from './types';

export const battleZoneValues = ['HEAD', 'CHEST', 'HANDS', 'FEET'] as const;
export const battleShieldZoneValues = [
  ['HEAD', 'CHEST'],
  ['CHEST', 'HANDS'],
  ['HANDS', 'FEET'],
  ['FEET', 'HEAD'],
] as const;

export type SelectedAttackingZone = z.infer<typeof selectedAttackingZoneSchema>;
export type SelectedDefenseZone = z.infer<typeof selectedDefenseZoneSchema>;

export type BattleSide = 'ATTACKER' | 'DEFENDER';
export type BattleParticipantType = 'HERO' | 'CREATURE';
export type BattleStatusType = 'IN_PROGRESS' | 'FINISHED';
export type DamageType = 'MAGIC' | 'PHYSICAL';

export type BattleZoneType = (typeof battleZoneValues)[number];
export type BattleShieldZoneType = (typeof battleShieldZoneValues)[number];

export type HandResult = 'HIT' | 'BLOCKED' | 'MISSED' | null;

export interface PhysicalAttackResult {
  LEFT_HAND: {
    hit: BattleZoneType | null;
    handResult: HandResult | null;
    giveDamage: number;
    currentHealthAfterHit: number;
    isCriticalDamage: boolean;
  };
  RIGHT_HAND: {
    hit: BattleZoneType | null;
    handResult: HandResult | null;
    giveDamage: number;
    currentHealthAfterHit: number;
    isCriticalDamage: boolean;
  };
}
export interface AbilityResult {}
export interface SkipRoundResult {
  participantId: string;
  participantName: string;
  message: string;
}
export type PendingActionResult =
  | {
      type: 'PHYSICAL_ATTACK';
      hitResult: PhysicalAttackResult;
    }
  | {
      type: 'ABILITY';
      abilityResult: AbilityResult;
    }
  | {
      type: 'SKIP_ROUND';
      skipRoundResult: SkipRoundResult;
    };

export type BattleActionType = 'PHYSICAL_ATTACK' | 'ABILITY' | 'SKIP_ROUND';

export type BattleLocation = {
  mapId: string;
  x: number;
  y: number;
};
export type Battle = {
  id: string;
  status: BattleStatusType;
  currentRound: number;
  roundEndsAt: number;
  location: BattleLocation;
  pendingActions: BattlePendingAction[];
  logs: BattleLog[];
  participants: BattleParticipant[];
};
export type BattleDto = {
  id: string;
  status: BattleStatusType;
  currentRound: number;
  roundEndsAt: number;
  pendingActions: BattlePendingAction[];
  logs: BattleLog[];
  participants: BattleParticipantDto[];
};
export type BattleParticipantDto = Omit<BattleParticipant, 'modifier'> & { modifier: Partial<Modifier> };
export type BattleParticipant = Pick<
  Hero,
  | 'id'
  | 'name'
  | 'currentHealth'
  | 'maxHealth'
  | 'currentMana'
  | 'maxMana'
  | 'level'
  | 'avatarImage'
  | 'characterImage'
  | 'equipments'
  | 'buffs'
> & {
  scale?: number;
  stat?: IHeroStat;
  modifier: Modifier;
  type: BattleParticipantType;
  side: BattleSide;
  isDead: boolean;
  targetId: string | null;
  combatStats: CombatStats[];
};

export type CombatStats = {
  targetId: string;
  value: number;
  isCritical: boolean;
  targetType: BattleParticipantType;
  type: 'DAMAGE' | 'HEAL';
};
export type BattleLog = PhysicalAttackLog | AbilityLog | SkipRoundLog;

export type PhysicalAttackLog = {
  id: string;
  type: 'PHYSICAL_ATTACK';
  attackerId: string;
  attackerName: string;
  targetId: string;
  targetName: string;
  giveDamage: number;
  targetHealthAfterHit: number;
  targetMaxHealth: number;
  defendZone: SelectedDefenseZone | null;
  attackingZone: BattleZoneType | null;
  hand: WeaponAttackHand;
  isMissed: boolean;
  isCriticalDamage: boolean;
  isBlocking: boolean;
  createdAt: number;
};
export type AbilityLog = {
  id: string;
  type: 'ABILITY';
  casterId: string;
  casterName: string;
  targetId: string;
  targetName: string;
  abilityId: string;
  abilityName: string;
  isMissed: boolean;
  isCriticalDamage: boolean;
  giveDamage?: number;
  healAmount?: number;
  targetHealthAfterHit: number;
  targetMaxHealth: number;
  createdAt: number;
};
export type SkipRoundLog = SkipRoundResult & {
  id: string;
  type: 'SKIP_ROUND';
};

export type BattlePendingAction = {
  id: string;
  participantId: string;
  targetId: string;
  type: BattleActionType;
  defenseZone: SelectedDefenseZone | null;
  attackingZone: SelectedAttackingZone;
  abilityId?: string;
  isResolved: boolean;
};

const battleZoneSchema = z.enum(battleZoneValues);

const battleShieldZoneSchema = z.union([
  z.tuple([z.literal('HEAD'), z.literal('CHEST')]),
  z.tuple([z.literal('CHEST'), z.literal('HANDS')]),
  z.tuple([z.literal('HANDS'), z.literal('FEET')]),
  z.tuple([z.literal('FEET'), z.literal('HEAD')]),
]);

const selectedAttackingZoneSchema = z.object({
  LEFT_HAND: battleZoneSchema.nullable(),
  RIGHT_HAND: battleZoneSchema.nullable(),
});

const selectedDefenseZoneSchema = z.union([battleZoneSchema, battleShieldZoneSchema]);

export const endTurnSchema = z.object({
  attackingZone: selectedAttackingZoneSchema,
  defenseZone: selectedDefenseZoneSchema,
  targetId: z.string().uuid(),
});
