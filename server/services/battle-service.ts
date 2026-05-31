import type { BattleSocketEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type {
  Battle,
  BattleAction,
  BattleLog,
  BattleParticipant,
  BattleParticipantType,
  BattleSide,
  BattleZoneType,
  DamageType,
  EquipmentSlotType,
  HandResult,
  HitResult,
  ItemInstance,
  Modifier,
  SelectedAttackingZone,
  SelectedDefenseZone,
} from '@/shared/types';
import { getAttackingRandomZone, getDefenseRandomZone, sumAllModifier } from '@/shared/utils';
import { HTTPException } from 'hono/http-exception';

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
  equipments: ItemInstance[];
}

interface GetBattleLogParam {
  hitResult: HitResult;
  attacker: BattleParticipant;
  defender: BattleParticipant;
  defendZone: SelectedDefenseZone;
  defenderCurrentHealth: number;
  defenderMaxHealth: number;
}

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
  getBattleLog({ attacker, defender, defendZone, hitResult, defenderCurrentHealth, defenderMaxHealth }: GetBattleLogParam): BattleLog[] {
    const logs = (Object.keys(hitResult) as (keyof HitResult)[])
      .map((hand) => {
        const { hit, handResult, giveDamage, isCriticalDamage } = hitResult[hand];
        if (!hit) return;
        return {
          id: generateRandomUuid(),
          attackerId: attacker.id,
          attackerName: attacker.name,
          defenderId: defender.id,
          defenderName: defender.name,
          attackingZone: hit,
          defenderCurrentHealth,
          defenderMaxHealth,
          defendZone,
          hand,
          isBlocking: handResult === 'BLOCKED' ? true : false,
          isMissed: handResult === 'MISSED' ? true : false,
          isCriticalDamage,
          giveDamage,

          createdAt: Date.now(),
        };
      })
      .filter((l) => !!l);

    return logs;
  },
  initBattle() {
    const id = generateRandomUuid();
    const newBattle: Battle = {
      id,
      roundEndsAt: this.getRoundDuration(),
      currentRound: 1,
      status: 'IN_PROGRESS',
      logs: [],
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
          stat: hero.stat,
          equipments: hero.equipments,
          buffs: hero.buffs,
          isDead: false,
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
          modifier: creature.modifier,
          equipments: [],
          buffs: [],
          isDead: false,
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
    const enemies = battle.participants.filter((p) => p.side !== participant.side && !p.isDead);
    const validTargets = enemies.filter((e) =>
      battle.pendingActions.some((a) => a.targetId !== e.id && a.participantId === participant.id),
    );

    const random = Math.floor(Math.random() * enemies.length);
    if (!validTargets.length && !enemies.length) return;
    const targetId = validTargets.length ? validTargets[random].id : enemies[random].id;
    participant.targetId = targetId;
    return participant;
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
    const firstSumModifier = sumAllModifier(firstParticipant.stat, firstParticipant.modifier);
    const secondSumModifier = sumAllModifier(secondParticipant.stat, secondParticipant.modifier);

    const firstHitResult = this.checkHitResult({
      attackZone: firstAction.attackingZone,
      defendZone: secondAction.defenseZone,
      attackerModifier: firstSumModifier,
      defenderModifier: secondSumModifier,
      damageType: 'PHYSICAL',
      equipments: firstParticipant.equipments,
    });
    const secondHitResult = this.checkHitResult({
      attackZone: secondAction.attackingZone,
      defendZone: firstAction.defenseZone,
      attackerModifier: secondSumModifier,
      defenderModifier: firstSumModifier,
      damageType: 'PHYSICAL',
      equipments: secondParticipant.equipments,
    });

    const firstCurrentHealth =
      firstParticipant.currentHealth - (secondHitResult.LEFT_HAND.giveDamage + secondHitResult.RIGHT_HAND.giveDamage);
    const secondCurrentHealth =
      secondParticipant.currentHealth - (firstHitResult.LEFT_HAND.giveDamage + firstHitResult.RIGHT_HAND.giveDamage);
    this.updateParticipant(firstParticipant, { currentHealth: firstCurrentHealth });
    this.updateParticipant(secondParticipant, { currentHealth: secondCurrentHealth });

    const firstBattleLog = this.getBattleLog({
      attacker: firstParticipant,
      defender: secondParticipant,
      defendZone: secondAction.defenseZone,
      hitResult: firstHitResult,
      defenderCurrentHealth: secondCurrentHealth,
      defenderMaxHealth: secondParticipant.maxHealth,
    });
    const secondBattleLog = this.getBattleLog({
      attacker: secondParticipant,
      defender: firstParticipant,
      defendZone: firstAction.defenseZone,
      hitResult: secondHitResult,
      defenderCurrentHealth: firstCurrentHealth,
      defenderMaxHealth: firstParticipant.maxHealth,
    });
    battle.logs.push(...[...firstBattleLog, ...secondBattleLog]);

    socketService.sendToClientBattleUpdate(battle.id, {
      type: 'PARTICIPANT_UPDATE',
      payload: [
        {
          id: firstParticipant.id,
          currentHealth: firstCurrentHealth,
        },
        {
          id: secondParticipant.id,
          currentHealth: secondCurrentHealth,
        },
      ],
    });
    socketService.sendToClientBattleUpdate(battle.id, { type: 'LOG_ADD', payload: [...firstBattleLog, ...secondBattleLog] });
    for (const action of [firstAction, secondAction]) {
      this.removeActionPending(battle.pendingActions, action.id);
    }
    socketService.sendToClientBattleUpdate(battle.id, { type: 'ACTIONS_REMOVE', payload: [firstAction.id, secondAction.id] });
  },

  checkHitResult({ attackZone, defendZone, attackerModifier, defenderModifier, damageType, equipments }: CheckHitParams): HitResult {
    const hitResult: HitResult = {
      LEFT_HAND: { hit: null, handResult: null, giveDamage: 0, isCriticalDamage: false },
      RIGHT_HAND: { hit: null, handResult: null, giveDamage: 0, isCriticalDamage: false },
    };

    for (const hand of Object.keys(hitResult) as (keyof HitResult)[]) {
      const zone = attackZone[hand];
      if (!zone) continue;

      hitResult[hand].hit = zone;

      const isDodged = battleCalculateService.isDodged({ attackerModifier, defenderModifier, damageType });
      if (isDodged) {
        hitResult[hand].handResult = 'MISSED';
        continue;
      }

      const isBlocked = battleCalculateService.isZoneBlocked(zone, defendZone);
      if (isBlocked) {
        hitResult[hand].handResult = 'BLOCKED';
        continue;
      }

      const isCritical = battleCalculateService.isCriticalHit(attackerModifier, defenderModifier, damageType);
      console.log('isCritical', isCritical);
      hitResult[hand].handResult = 'HIT';
      hitResult[hand].isCriticalDamage = isCritical;
      hitResult[hand].giveDamage = battleCalculateService.calculatePhysicalDamage({
        attackerModifier,
        defenderModifier,
        isCritical,
        equipments,
        hitHand: hand,
      });
    }

    return hitResult;
  },
  updateParticipant(participant: BattleParticipant, updateData: Partial<BattleParticipant>) {
    Object.assign(participant, updateData);
  },
  onParticipantDead(deadParticipant: BattleParticipant, battle: Battle) {
    deadParticipant.isDead = true;

    const removeActionsId = battle.pendingActions.filter((a) => a.participantId === deadParticipant.id).map((a) => a.id);
    battle.pendingActions = battle.pendingActions.filter((a) => a.participantId !== deadParticipant.id);

    const participantsTargetingDead = battle.participants.filter((p) => p.targetId === deadParticipant.id);

    for (const participant of participantsTargetingDead) {
      this.setNextTargetParticipant(battle, participant.id);
    }

    socketService.sendToClientBattleUpdate(battle.id, {
      type: 'ACTIONS_REMOVE',
      payload: removeActionsId,
    });
    socketService.sendToClientBattleUpdate(battle.id, {
      type: 'PARTICIPANT_UPDATE',
      payload: [deadParticipant, ...participantsTargetingDead],
    });
  },
};
