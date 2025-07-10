import type { SocketResponse } from '@/shared/types';
import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { db } from '../db/db';
import { heroTable } from '../db/schema';

export const inviteParty = (socket: Socket) => {
  socket.on(
    'invite-party',
    async ({ invitedHeroId, selfId }: { selfId: string; invitedHeroId: string }, response: (data: SocketResponse) => void) => {
      const self = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, selfId),
      });
      const invitedHero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, invitedHeroId),
      });
      if (!self || !invitedHero) {
        return response({ message: 'hero no found', success: false });
      }
      const filteredSelf = {
        name: self.name,
        level: self.level,
        avatarImage: self.avatarImage,
      };
      try {
        const cb = await socket.timeout(5_000).emitWithAck(`invite-party-${invitedHeroId}`, filteredSelf);
        if (!cb.accept) {
          response({ success: false, message: `${invitedHero.name} not accept` });
        } else {
          response({ success: true, message: `${invitedHero.name} ACCEPT` });
        }
      } catch (error) {
        response({ message: `${invitedHero.name} AFK`, success: false });
      }
    },
  );
};
