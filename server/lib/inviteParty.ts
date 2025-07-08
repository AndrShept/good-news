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
      try {
        const cb = await socket.timeout(5_000).to('main').emitWithAck(`invite-party-${invitedHeroId}`, self);
        if (!cb.accept) {
          return response({ success: true, message: `${invitedHero.name} ot accpeted accepted` });
        } else {
          return response({ success: true, message: `${invitedHero.name} ACCEPT` });
        }
      } catch (error) {
        return response({ message: `${invitedHero.name} AFK`, success: false });
      }
    },
  );
};
