import type { SocketGroupResponse } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { Group, Hero, SocketResponse } from '@/shared/types';
import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { io } from '..';
import { db } from '../db/db';
import { groupTable, heroTable } from '../db/schema';

interface IValidateGroupMembers {
  fromHero: typeof heroTable.$inferSelect & { group: typeof groupTable.$inferSelect | null | undefined };
  invitedHero: typeof heroTable.$inferSelect ;
}

const validateGroupMembers = async ({ fromHero, invitedHero }: IValidateGroupMembers) => {
  if (invitedHero.groupId) {
    return { message: invitedHero.name + ' is already in a group and cannot be accepted.', success: false };
  }

  if (invitedHero.state === 'BATTLE') {
    return { message: invitedHero.name + ' is in a battle and cannot be accepted.', success: false };
  }

  const groupCount = await db.$count(groupTable, eq(groupTable.id, fromHero.groupId!));

  if (groupCount >= 3) {
    return { success: false, message: `The group is full and cannot accept more players.` };
  }
  const isGroupLeader = fromHero.group && fromHero.group.leaderId === fromHero.id;

  if (!isGroupLeader) {
    return { success: false, message: `Only the group leader can invite players to the group.` };
  }
};

export const inviteGroup = async (socket: Socket) => {
  socket.on(
    socketEvents.groupInvite(),
    async ({ toHeroId, fromHeroId }: { fromHeroId: string; toHeroId: string }, response: (data: SocketResponse) => void) => {
      const invitedHero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, toHeroId),
      });
      const fromHero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, fromHeroId),
        with: {
          group: true,
        },
      });
      if (!fromHero) {
        return response({ message: 'self no found', success: false });
      }
      if (!invitedHero) {
        return response({ message: 'invitedHero no found', success: false });
      }
      const validate = await validateGroupMembers({
        fromHero: { ...fromHero, group: fromHero.group ?? undefined },
        invitedHero,
      });
      if (validate) {
        return response({
          message: validate.message,
          success: validate.success,
        });
      }

      const data = {
        name: fromHero.name,
        level: fromHero.level,
        avatarImage: fromHero?.avatarImage,
        waitTime: 20_000,
        groupId: fromHero.groupId,
      };
      try {
        const [cb] = await socket.timeout(data.waitTime).broadcast.emitWithAck(socketEvents.groupInvited(toHeroId), data);
        if (!cb.accept) {
          response({ success: false, message: `${invitedHero.name} has declined the group invitation.` });
        }
        if (cb.accept) {
          const invitedHero = await db.query.heroTable.findFirst({
            where: eq(heroTable.id, toHeroId),
          });
          const fromHero = await db.query.heroTable.findFirst({
            where: eq(heroTable.id, fromHeroId),
            with: {
              group: true,
            },
          });
          if (!fromHero) {
            return response({ message: 'self no found', success: false });
          }
          if (!invitedHero) {
            return response({ message: 'invitedHero no found', success: false });
          }
          const validate = await validateGroupMembers({
            fromHero: { ...fromHero, group: fromHero.group ?? undefined },
            invitedHero,
          });
          if (validate) {
            return response({
              message: validate.message,
              success: validate.success,
            });
          }
          await db
            .update(heroTable)
            .set({
              groupId: fromHero.groupId,
            })
            .where(eq(heroTable.id, invitedHero.id));
          const messageData: SocketGroupResponse = {
            message: `${invitedHero.name} has joined the group.`,
            groupId: fromHero.groupId ?? '',
            updateType: 'new-member',
            messageType: 'SUCCESS',
          };
          io.to(fromHero.groupId!).emit(socketEvents.groupUpdated(), messageData);
          return response({ success: true, message: `${invitedHero.name} has joined your group.` });
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
