import type {
  AbilityResult,
  Battle,
  BattleLocation,
  BattleLog,
  BattleParticipant,
  BattleParticipantType,
  BattlePendingAction,
  BattleSide,
  CombatStats,
  DamageType,
  PendingActionResult,
  PhysicalAttackResult,
  SelectedAttackingZone,
  SelectedDefenseZone,
  SkipRoundLog,
  SkipRoundResult,
} from '@/shared/battle-types';
import type { ItemInstance, Modifier, WeaponAttackHand } from '@/shared/types';
import { getAttackingRandomZone, getDefenseRandomZone, sumAllModifier } from '@/shared/utils';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { SPAWN_ZONE_CREATURE_TABLE } from '../lib/table/spawn-zone-creature-table';
import { generateRandomUuid } from '../lib/utils';
import { battleCalculateService } from './battle-calculate-service';
import { corpseService } from './corpse-service';
import { creatureService } from './creature-service';
import { heroService } from './hero-service';
import { mapService } from './map-service';
import { placeService } from './place-service';
import { socketService } from './socket-service';

interface GetParticipantData {
  participantId: string;
  type: BattleParticipantType;
  side: BattleSide;
}

interface GetBattleLogParams {
  actionResult: PendingActionResult;
  attackerParticipant: BattleParticipant;
  targetParticipant: BattleParticipant;
  targetDefenseZone: SelectedDefenseZone | null;
}

interface ResolveActionPairParam {
  battle: Battle;
  action: BattlePendingAction;
  attackerParticipant: BattleParticipant;
  targetParticipant: BattleParticipant;
  targetDefenseZone: SelectedDefenseZone | null;
}

interface GetCombatStatParam {
  actionResult: PendingActionResult;
  targetParticipant: BattleParticipant;
}

interface ActionResultParam {
  action: BattlePendingAction;
  attackerParticipant: BattleParticipant;
  targetParticipant: BattleParticipant;
  attackerSumModifier: Modifier;
  targetSumModifier: Modifier;
  targetDefenseZone: SelectedDefenseZone | null;
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
  getRoundDuration(participantLength: number) {
    return Date.now() + Math.min(participantLength * 10_000, 60_000);
  },

  initBattle(location: BattleLocation, participantLength: number) {
    const id = generateRandomUuid();
    const newBattle: Battle = {
      id,
      roundEndsAt: this.getRoundDuration(participantLength),
      currentRound: 1,
      status: 'IN_PROGRESS',
      location,
      logs: [],
      pendingActions: [],
      participants: [],
    };
    serverState.battle.set(id, newBattle);

    return newBattle;
  },
  startBattle(partData: GetParticipantData[], location: BattleLocation) {
    const newBattle = battleService.initBattle(location, partData.length);
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
      socketService.sendToClientUpdateSelfHeroData(participant.id, { battleId, state: 'BATTLE' });
      if (hero.location.chunkId) {
        socketService.sendMapUpdateEntity(participant.id, hero.location.chunkId, { type: 'HERO', payload: { state: 'BATTLE' } });
      }
    }
    if (participant.type === 'CREATURE') {
      const creature = creatureService.getCreature(participant.id);
      creature.state = 'BATTLE';
      const chunkId = mapService.getChunkId({ mapId: creature.mapId, x: creature.x, y: creature.y });
      socketService.sendMapUpdateEntity(participant.id, chunkId, { type: 'CREATURE', payload: { state: 'BATTLE' } });
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
          combatStats: [],
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
          combatStats: [],
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

    const creatureAction: BattlePendingAction = {
      id: generateRandomUuid(),
      type: 'PHYSICAL_ATTACK',
      attackingZone,
      defenseZone,
      isResolved: false,
      participantId: creatureParticipant.id,
      targetId,
    };
    battle.pendingActions.push(creatureAction);

    socketService.sendToClientBattleUpdate(battle.id, {
      type: 'ACTIONS_ADD',
      payload: creatureAction,
    });
  },
  removeActionPending(actionsPending: BattlePendingAction[], actionId: string) {
    const index = actionsPending.findIndex((a) => a.id === actionId);

    if (index === -1) {
      throw new HTTPException(400, { message: 'actionsPending index not found' });
    }
    actionsPending.splice(index, 1);
  },
  actionResult({
    action,
    attackerParticipant,
    targetParticipant,
    attackerSumModifier,
    targetSumModifier,
    targetDefenseZone,
  }: ActionResultParam) {
    let actionResult: PendingActionResult | null = null;
    switch (action.type) {
      case 'PHYSICAL_ATTACK': {
        const hitResult: PhysicalAttackResult = {
          RIGHT_HAND: { hit: null, handResult: null, giveDamage: 0, currentHealthAfterHit: 0, isCriticalDamage: false },
          LEFT_HAND: { hit: null, handResult: null, giveDamage: 0, currentHealthAfterHit: 0, isCriticalDamage: false },
        };

        for (const hand of Object.keys(hitResult) as WeaponAttackHand[]) {
          const zone = action.attackingZone[hand];
          if (!zone) continue;
          if (targetParticipant.currentHealth <= 0) continue;

          hitResult[hand].hit = zone;

          const isDodged = battleCalculateService.isDodged({
            attackerModifier: attackerSumModifier,
            targetModifier: targetSumModifier,
            damageType: 'PHYSICAL',
          });
          if (isDodged) {
            hitResult[hand].handResult = 'MISSED';
            continue;
          }

          const isBlocked = battleCalculateService.isZoneBlocked(zone, targetDefenseZone);
          if (isBlocked) {
            hitResult[hand].handResult = 'BLOCKED';
            continue;
          }

          const isCritical = battleCalculateService.isCriticalHit({
            attackerModifier: attackerSumModifier,
            targetModifier: targetSumModifier,
            damageType: 'PHYSICAL',
          });
          hitResult[hand].handResult = 'HIT';
          hitResult[hand].isCriticalDamage = isCritical;
          hitResult[hand].giveDamage = battleCalculateService.calculatePhysicalDamage({
            attackerModifier: attackerSumModifier,
            targetModifier: targetSumModifier,
            isCritical,
            equipments: attackerParticipant.equipments,
            hitHand: hand,
          });

          const currentHealthAfterHit = Math.max(targetParticipant.currentHealth - hitResult[hand].giveDamage, 0);
          hitResult[hand].currentHealthAfterHit = currentHealthAfterHit;
          this.updateParticipant(targetParticipant, { currentHealth: currentHealthAfterHit });
        }
        actionResult = {
          type: action.type,
          hitResult,
        };
        return actionResult;
      }
      case 'ABILITY': {
        actionResult = {
          type: action.type,
          abilityResult: {},
        };
        return actionResult;
      }
      case 'SKIP_ROUND': {
        actionResult = {
          type: action.type,
          skipRoundResult: {
            message: `skipped their turn`,
            participantId: attackerParticipant.id,
            participantName: attackerParticipant.name,
          },
        };
        return actionResult;
      }
    }
  },
  getBattleLog({ actionResult, attackerParticipant, targetParticipant, targetDefenseZone }: GetBattleLogParams) {
    const battleLogs: BattleLog[] = [];

    switch (actionResult.type) {
      case 'PHYSICAL_ATTACK':
        for (const hand of Object.keys(actionResult.hitResult) as WeaponAttackHand[]) {
          const { hit, handResult, giveDamage, isCriticalDamage, currentHealthAfterHit } = actionResult.hitResult[hand];
          if (!hit) continue;
          battleLogs.push({
            id: generateRandomUuid(),
            attackerId: attackerParticipant.id,
            attackerName: attackerParticipant.name,
            targetId: targetParticipant.id,
            targetName: targetParticipant.name,
            targetHealthAfterHit: currentHealthAfterHit,
            targetMaxHealth: targetParticipant.maxHealth,
            attackingZone: hit,
            defendZone: targetDefenseZone,
            hand,
            type: 'PHYSICAL_ATTACK',
            isBlocking: handResult === 'BLOCKED' ? true : false,
            isMissed: handResult === 'MISSED' ? true : false,
            isCriticalDamage,
            giveDamage,

            createdAt: Date.now(),
          });
        }
        break;
      case 'ABILITY':
        break;
      case 'SKIP_ROUND':
        battleLogs.push({
          id: generateRandomUuid(),
          type: 'SKIP_ROUND',
          createdAt: Date.now(),
          ...actionResult.skipRoundResult,
        });
        break;
    }

    return battleLogs;
  },
  resolveActionPair({ battle, action, attackerParticipant, targetParticipant, targetDefenseZone }: ResolveActionPairParam) {
    const attackerSumModifier = sumAllModifier(attackerParticipant.stat, attackerParticipant.modifier);
    const targetSumModifier = sumAllModifier(targetParticipant.stat, targetParticipant.modifier);
    const actionResult = this.actionResult({
      action,
      attackerParticipant,
      targetParticipant,
      attackerSumModifier,
      targetSumModifier,
      targetDefenseZone,
    });

    action.isResolved = true;

    const battleLogs = this.getBattleLog({
      attackerParticipant,
      targetParticipant,
      actionResult,
      targetDefenseZone,
    });

    const combatStats = this.getCombatStat({
      actionResult,
      targetParticipant,
    });

    battle.logs.push(...battleLogs);
    attackerParticipant.combatStats.push(...combatStats);

    socketService.sendToClientBattleUpdate(battle.id, [
      { type: 'LOG_ADD', payload: battleLogs },
      {
        type: 'COMBAT_STATS_ADD',
        payload: {
          participantId: attackerParticipant.id,
          combatStats,
        },
      },
      {
        type: 'PARTICIPANT_UPDATE',
        payload: [
          {
            id: targetParticipant.id,
            currentHealth: targetParticipant.currentHealth,
          },
        ],
      },
    ]);
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

    if (removeActionsId.length) {
      socketService.sendToClientBattleUpdate(battle.id, {
        type: 'ACTIONS_REMOVE',
        payload: removeActionsId,
      });
    }
    socketService.sendToClientBattleUpdate(battle.id, {
      type: 'PARTICIPANT_UPDATE',
      payload: [deadParticipant, ...participantsTargetingDead],
    });
  },
  finishBattle(battle: Battle, now: number) {
    if (!battle.location) throw new HTTPException(400, { message: 'battle location not found' });
    for (const participant of battle.participants) {
      switch (participant.type) {
        case 'HERO': {
          const hero = heroService.getHero(participant.id);
          const socket = socketService.getSocket(hero.id);
          socket.leave(battle.id);
          hero.battleId = null;
          hero.state = 'IDLE';
          hero.currentHealth = participant.currentHealth;
          hero.currentMana = participant.currentMana;
          socketService.sendToClientUpdateSelfHeroData(hero.id, {
            battleId: null,
            currentHealth: participant.currentHealth,
            currentMana: participant.currentMana,
            state: 'IDLE',
          });
          if (!hero.location.chunkId) continue;
          socketService.sendMapUpdateEntity(hero.id, hero.location.chunkId, { type: 'HERO', payload: { state: 'IDLE' } });
          if (participant.isDead) {
            corpseService.createHeroCorpse({
              hero,
              now,
              chunkId: hero.location.chunkId,
            });
            placeService.onTeleportNearTown(hero);
            socketService.sendToClientSysMessage(hero.id, { color: 'RED', text: 'You died and were teleported to the nearest town' });
          }
          break;
        }
        case 'CREATURE': {
          const creature = creatureService.getCreature(participant.id);

          const chunkId = mapService.getChunkId({ mapId: creature.mapId, x: creature.x, y: creature.y });
          const chunk = serverState.mapChunks.get(chunkId);
          if (!chunk) continue;
          creature.state = 'IDLE';
          socketService.sendMapUpdateEntity(creature.id, chunkId, { type: 'CREATURE', payload: { state: 'IDLE' } });
          if (participant.isDead) {
            const spawnZone = creatureService.getSpawnZone(creature.key);
            if (!spawnZone) continue;
            if (chunk.spawnZones[spawnZone].lastSpawnAt <= now) {
              chunk.spawnZones[spawnZone].lastSpawnAt = now + SPAWN_ZONE_CREATURE_TABLE[spawnZone].respawnTime;
            }
            chunk.spawnZones[spawnZone].creatureAlive--;

            corpseService.createCreatureCorpse({
              chunkId,
              creature,
              now,
            });
          }

          break;
        }
      }
    }

    battle.status = 'FINISHED';
    serverState.battle.delete(battle.id);
  },

  getCombatStat({ actionResult, targetParticipant }: GetCombatStatParam) {
    const combatStats: CombatStats[] = [];

    switch (actionResult.type) {
      case 'PHYSICAL_ATTACK':
        for (const hand of Object.keys(actionResult.hitResult) as WeaponAttackHand[]) {
          const { giveDamage, isCriticalDamage, hit } = actionResult.hitResult[hand];
          if (!hit) continue;
          combatStats.push({
            targetId: targetParticipant.id,
            type: 'DAMAGE',
            targetType: targetParticipant.type,
            isCritical: isCriticalDamage,
            value: giveDamage,
          });
        }
    }

    return combatStats;
  },

  nextRound(battle: Battle) {
    battle.currentRound++;
    const filterPendingActions = battle.pendingActions.filter((a) => !a.isResolved);
    battle.pendingActions = filterPendingActions;

    battle.roundEndsAt = battleService.getRoundDuration(battle.participants.length);
    socketService.sendToClientBattleUpdate(battle.id, [
      {
        type: 'BATTLE_UPDATE',
        payload: {
          currentRound: battle.currentRound,
          roundEndsAt: battle.roundEndsAt,
        },
      },
      {
        type: 'ACTIONS_SET',
        payload: filterPendingActions,
      },
    ]);
  },
};
