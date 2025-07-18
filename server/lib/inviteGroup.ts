import { socketEvents } from '@/shared/socket-events';
import type { SocketResponse } from '@/shared/types';
import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { io } from '..';
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
      const data = {
        name: self.name,
        level: self.level,
        avatarImage: self.avatarImage,
        waitTime: 20_000,
      };
      try {
        const [cb] = await socket.timeout(data.waitTime).broadcast.emitWithAck(socketEvents.groupInvited(toHeroId), data);
        console.log('cb', cb);
        if (!cb.accept) {
          console.log('ASMR', false);
          response({ success: false, message: `${invitedHero.name} has declined the group invitation.` });
        }
        if (cb.accept) {
          console.log('ASMR', true);
          response({ success: true, message: `${invitedHero.name} has joined your group.` });
        }
        if (cb === undefined) {
          response({ success: false, message: `${invitedHero.name} cannot invite group` });
        }
      } catch (error) {
        response({ message: `${invitedHero.name} ignored the group invitation.`, success: false });
      }
    },
  );
};
