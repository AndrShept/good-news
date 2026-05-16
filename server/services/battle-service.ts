import type { BattleUpdateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type {
  Battle,
  BattleAction,
  BattleParticipant,
  BattleParticipantType,
  BattleSide,
  DamageType,
  EquipmentSlotType,
  HandResult,
  ItemInstance,
  Modifier,
  SelectedAttackingZone,
  SelectedDefenseZone,
} from '@/shared/types';
import { getAttackingRandomZone, getDefenseRandomZone } from '@/shared/utils';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { serverState } from '../game/state/server-state';
import { generateRandomUuid } from '../lib/utils';
import { battleCalculateService } from './battle-calculate-service';
import { creatureService } from './creature-service';
import { heroService } from './hero-service';
import { socketService } from './socket-service';

interface GetParticipantData {
  participantId: string;
  type: BattleParticipantType;
  side: BattleSide;
}

interface CheckHitParams {
  attackZone: SelectedAttackingZone;
  defendZone: SelectedDefenseZone;
  attackerModifier: Modifier;
  defenderModifier: Modifier;
  damageType: DamageType;
}

type CheckHitResult = {
  LEFT_HAND: HandResult;
  RIGHT_HAND: HandResult;
};

type CalculateDamageParams = {
  hand: 'LEFT_HAND' | 'RIGHT_HAND';
  hitResult: HandResult;
  attackerModifier: Modifier;
  defenderModifier: Modifier;
  weapon?: ItemInstance;
  abilityId?: string; // якщо магія
};

export const battleService = {
  getBattle(battleId: string) {
    const battle = serverState.battle.get(battleId);
    if (!battle) throw new HTTPException(400, { message: 'Battle not found' });
    return battle;
  },
  getParticipant(battle: Battle, participantId: string) {
    const participant = battle.participants.find((p) => p.id === participantId);
    if (!participant) throw new HTTPException(400, { message: 'participant not found' });
    return participant;
  },
  getRoundDuration() {
    return Date.now() + 90_000;
  },

  initBattle() {
    const id = generateRandomUuid();
    const newBattle: Battle = {
      id,
      roundEndsAt: this.getRoundDuration(),
      currentRound: 1,
      status: 'IN_PROGRESS',
      log: [],
      pendingActions: [],
      participants: [],
    };
    serverState.battle.set(id, newBattle);

    return newBattle;
  },
  startBattle(partData: GetParticipantData[]) {
    const newBattle = battleService.initBattle();
    for (const participantInfo of partData) {
      const participant = battleService.getParticipantData({
        participantId: participantInfo.participantId,
        side: participantInfo.side,
        type: participantInfo.type,
      });
      this.addParticipantInBattle(newBattle.id, participant);
    }
    for (const participantInfo of partData) {
      this.setNextTargetParticipant(newBattle, participantInfo.participantId);
    }
  },
  addParticipantInBattle(battleId: string, participant: BattleParticipant) {
    const battle = this.getBattle(battleId);
    battle.participants.push(participant);
    if (participant.type === 'HERO') {
      const hero = heroService.getHero(participant.id);
      const heroSocket = socketService.getSocket(participant.id);
      heroSocket.join(battleId);
      hero.state = 'BATTLE';
      hero.battleId = battleId;
    }
    if (participant.type === 'CREATURE') {
      const creature = creatureService.getCreature(participant.id);
      creature.state = 'BATTLE';
    }
  },
  getParticipantData({ participantId, side, type }: GetParticipantData) {
    switch (type) {
      case 'HERO':
        const hero = heroService.getHero(participantId);
        const participant: BattleParticipant = {
          id: hero.id,
          name: hero.name,
          avatarImage: hero.avatarImage,
          characterImage: hero.characterImage,
          currentHealth: hero.currentHealth,
          currentMana: hero.currentMana,
          maxHealth: hero.maxHealth,
          maxMana: hero.maxMana,
          level: hero.level,
          modifier: hero.modifier,
          equipments: hero.equipments,
          buffs: hero.buffs,
          isAlive: true,
          targetId: null,
          side,
          type,
        };
        return participant;
      case 'CREATURE':
        const creature = creatureService.getCreature(participantId);
        const creatureParticipant: BattleParticipant = {
          id: creature.id,
          name: creature.name,
          avatarImage: creature.image,
          characterImage: creature.image,
          currentHealth: creature.currentHealth,
          currentMana: creature.currentMana,
          maxHealth: creature.maxHealth,
          maxMana: creature.maxMana,
          level: 1,
          modifier: creature.baseModifier as Modifier,
          equipments: [],
          buffs: [],
          isAlive: true,
          targetId: null,
          side,
          type,
          scale: creature.scale,
        };
        return creatureParticipant;
    }
  },
  setNextTargetParticipant(battle: Battle, participantId: string) {
    const participant = battle.participants.find((p) => p.id === participantId);
    if (!participant) return;
    const enemies = battle.participants.filter((p) => p.side !== participant.side && p.isAlive);

    const random = Math.floor(Math.random() * enemies.length);

    const targetId = enemies[random].id;
    participant.targetId = targetId;
  },
  createCreatureActionPending(battle: Battle, creatureParticipant: BattleParticipant, targetId: string) {
    const attackingZone = getAttackingRandomZone({ isEquipLeftHandWeapon: false, isEquipRightHandWeapon: true });
    const defenseZone = getDefenseRandomZone(false);
    battle.pendingActions.push({
      id: generateRandomUuid(),
      attackingZone,
      defenseZone,
      actionType: 'NORMAL',
      participantId: creatureParticipant.id,
      targetId,
      category: 'PHYSICAL_ATTACK',
    });
  },
  removeActionPending(actionsPending: BattleAction[], actionId: string) {
    const index = actionsPending.findIndex((a) => a.id === actionId);

    if (index === -1) {
      throw new HTTPException(400, { message: 'actionsPending index not found' });
    }
    actionsPending.splice(index, 1);
  },
  resolveActionPair(battle: Battle, firstAction: BattleAction, secondAction: BattleAction) {
    const firstParticipant = this.getParticipant(battle, firstAction.participantId);
    const secondParticipant = this.getParticipant(battle, secondAction.participantId);

    const firstHitResult = this.checkHitResult({
      attackZone: firstAction.attackingZone,
      defendZone: secondAction.defenseZone,
      attackerModifier: firstParticipant.modifier,
      defenderModifier: secondParticipant.modifier,
      damageType: 'PHYSICAL',
    });
    const secondHitResult = this.checkHitResult({
      attackZone: secondAction.attackingZone,
      defendZone: firstAction.defenseZone,
      attackerModifier: secondParticipant.modifier,
      defenderModifier: firstParticipant.modifier,
      damageType: 'PHYSICAL',
    });

    const firstIsCriticalHit = battleCalculateService.isCriticalHit(firstParticipant.modifier, secondParticipant.modifier, 'PHYSICAL');
    const secondaryIsCriticalHit = battleCalculateService.isCriticalHit(secondParticipant.modifier, firstParticipant.modifier, 'PHYSICAL');

    const firstGiveDamage = battleCalculateService.calculatePhysicalDamage(
      firstParticipant.modifier,
      secondParticipant.modifier,
      firstIsCriticalHit,
    );
    const secondaryGiveDamage = battleCalculateService.calculatePhysicalDamage(
      secondParticipant.modifier,
      firstParticipant.modifier,
      secondaryIsCriticalHit,
    );

    const socketData: BattleUpdateData = {
      participants: [
        { id: firstParticipant.id, currentHealth: 50 },
        { id: secondParticipant.id, currentHealth: 10 },
      ],
    };
    io.to(battle.id).emit(socketEvents.battleUpdate(), socketData);

    for (const action of [firstAction, secondAction]) {
      this.removeActionPending(battle.pendingActions, action.id);
    }
  },
  checkHitResult({ attackZone, defendZone, attackerModifier, defenderModifier, damageType }: CheckHitParams): CheckHitResult {
    const isDodged = battleCalculateService.isDodged({ attackerModifier, defenderModifier, damageType });

    if (isDodged) {
      return {
        LEFT_HAND: attackZone?.LEFT_HAND ? 'MISSED' : null,
        RIGHT_HAND: attackZone?.RIGHT_HAND ? 'MISSED' : null,
      };
    }

    return {
      LEFT_HAND: attackZone?.LEFT_HAND ? battleCalculateService.checkZoneBlocked(attackZone.LEFT_HAND, defendZone) : null,
      RIGHT_HAND: attackZone.RIGHT_HAND ? battleCalculateService.checkZoneBlocked(attackZone.RIGHT_HAND, defendZone) : null,
    };
  },
};
