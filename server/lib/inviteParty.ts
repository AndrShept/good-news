import { socketEvents } from '@/shared/socket-events';
import type { SocketResponse } from '@/shared/types';
import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { db } from '../db/db';
import { heroTable } from '../db/schema';

export const inviteParty = (socket: Socket) => {
  socket.on(
    socketEvents.partyInvite(),
    async ({ toHeroId, fromHeroId }: { fromHeroId: string; toHeroId: string }, response: (data: SocketResponse) => void) => {
      console.log(fromHeroId);
      console.log(toHeroId);
      const self = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, fromHeroId),
      });
      const invitedHero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, toHeroId),
      });
      if (!self || !invitedHero) {
        return response({ message: 'hero no found', success: false });
      }
      const filteredFromHero = {
        name: self.name,
        level: self.level,
        avatarImage: self.avatarImage,
      };
      try {
        const cb = await socket.timeout(5_000).emitWithAck(socketEvents.partyInvited(toHeroId), filteredFromHero);
        if (!cb.accept) {
          response({ success: false, message: `${invitedHero.name} has declined the party invitation.` });
        }
        response({ success: true, message: `${invitedHero.name} has joined your party.` });
      } catch (error) {
        response({ message: `${invitedHero.name} ignored the party invitation.`, success: false });
      }
    },
  );
};
