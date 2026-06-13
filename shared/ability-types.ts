import { z } from 'zod';

import type { DamageType } from './battle-types';

export type AbilityResourceType = 'MANA' | 'HEALTH' | 'HIT' | 'PHYS_CRIT' | 'MAGIC_CRIT' | 'BLOCK' | 'DODGE';

export interface Ability {
  id: string
  name: string
  description: string
  damageType: DamageType
  endsTurn: boolean

  effects: AbilityEffect[]

  cost: {
    type: AbilityResourceType
    amount: number
  }[]

  cooldown: number

  target: AbilityTarget
}

type AbilityTarget = 
  | 'SELF'
  | 'SINGLE_ENEMY'
  | 'ALL_ENEMIES'
  | 'SINGLE_ALLY'
  | 'ALL_ALLIES'

interface AbilityEffect {
  type: AbilityEffectType
  target: AbilityTarget
  duration?: number
  value?: number
}

type AbilityEffectType =
  | 'DAMAGE'
  | 'HEAL'
  | 'APPLY_STATUS'  
  | 'APPLY_BUFF'    
  | 'REMOVE_STATUS'  
