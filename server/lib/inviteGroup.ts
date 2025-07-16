import { socketEvents } from '@/shared/socket-events';
import type { SocketResponse } from '@/shared/types';
import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { db } from '../db/db';
import { heroTable } from '../db/schema';

export const inviteGroup = (socket: Socket) => {
  socket.on(
    socketEvents.groupInvite(),
    async ({ toHeroId, fromHeroId }: { fromHeroId: string; toHeroId: string }, response: (data: SocketResponse) => void) => {
      console.log(fromHeroId);
      console.log(toHeroId);
      const self = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, fromHeroId),
      });
      const invitedHero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, toHeroId),
      });
      if (!self) {
        return response({ message: 'self no found', success: false });
      }
      if (!invitedHero) {
        return response({ message: 'invitedHero no found', success: false });
      }
      const filteredFromHero = {
        name: self.name,
        level: self.level,
        avatarImage: self.avatarImage,
      };
      try {
        const cb = await socket.timeout(5_000).broadcast.emitWithAck(socketEvents.groupInvited(toHeroId), filteredFromHero);
        if (!cb.accept && !!Object.keys(cb).length) {
          response({ success: false, message: `${invitedHero.name} has declined the group invitation.` });
        }
        if (cb.accept) {
          response({ success: true, message: `${invitedHero.name} has joined your group.` });
        }
        if (Object.keys(cb).length === 0) {
          response({ success: false, message: `${invitedHero.name} offline` });
        }
      } catch (error) {
        response({ message: `${invitedHero.name} ignored the group invitation.`, success: false });
      }
    },
  );
};
