import type { Battle, BattleParticipant, BattleParticipantType, BattleSide, Modifier } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { generateRandomUuid } from '../lib/utils';
import { creatureService } from './creature-service';
import { heroService } from './hero-service';
import { socketService } from './socket-service';

interface GetParticipantData {
  participantId: string;
  type: BattleParticipantType;
  side: BattleSide;
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
};
