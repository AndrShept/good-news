import type { SocketGroupResponse } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { GameItem, Hero, PaginatedResponse, SuccessResponse, User } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, ilike, isNull, ne } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { io } from '..';
import type { Context } from '../context';
import { db } from '../db/db';
import { groupTable, heroTable } from '../db/schema';
import { generateRandomUuid } from '../lib/utils';
import { loggedIn } from '../middleware/loggedIn';

export const groupRouter = new Hono<Context>()
  .get(
    '/available-heroes',
    loggedIn,
    zValidator(
      'query',
      z.object({
        page: z.number({ coerce: true }),
        searchTerm: z.string(),
        selfId: z.string(),
      }),
    ),
    async (c) => {
      const { page, searchTerm, selfId } = c.req.valid('query');
      const limit = 10;
      const offset = (page - 1) * limit;

      const where = and(
        eq(heroTable.isOnline, true),
        isNull(heroTable.groupId),
        ne(heroTable.id, selfId),
        ilike(heroTable.name, `%${searchTerm}%`),
      );
      const heroes = await db.query.heroTable.findMany({
        limit,
        offset,
        where,
      });
      const totalPages = Math.ceil(heroes.length / limit);
      return c.json<PaginatedResponse<Hero[]>>({
        message: 'available heroes fetched!',
        success: true,
        data: heroes,
        pagination: {
          page,
          totalPages,
          isMore: page < totalPages,
        },
      });
    },
  )
  .get(
    '/:id/heroes',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const group = await db.query.groupTable.findFirst({
        where: eq(groupTable.id, id),
      });
      if (!group) {
        throw new HTTPException(404, { message: 'group not found' });
      }
      const heroes = await db.query.heroTable.findMany({
        where: eq(heroTable.groupId, id),
      });

      return c.json<SuccessResponse<Hero[]>>(
        {
          message: 'group members  fetched!',
          success: true,
          data: heroes,
        },
        200,
      );
    },
  )
  .delete(
    '/:id/delete',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');

      const user = c.get('user');

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.userId, user?.id ?? ''),
      });
      if (!hero) {
        throw new HTTPException(404, { message: 'hero not found' });
      }
      const group = await db.query.groupTable.findFirst({
        where: eq(groupTable.id, id),
      });

      if (!group) {
        throw new HTTPException(404, { message: 'group not found' });
      }

      const isGroupLeader = hero.id === group.leaderId;
      if (!isGroupLeader) {
        throw new HTTPException(403, { message: 'Only group leader can remove the group.' });
      }
      const heroes = await db.query.heroTable.findMany({
        where: eq(heroTable.groupId, id),
      });
      const messageData: SocketGroupResponse = {
        message: 'The group has been disbanded by the leader.',
        groupId: id,
        updateType: 'remove',
      };
      io.to(group.id).emit(socketEvents.groupUpdated(), messageData);
      await db.delete(groupTable).where(eq(groupTable.id, id));
      io.socketsLeave(group.id);

      return c.json<SuccessResponse>({
        message: 'group deleted',
        success: true,
      });
    },
  )
  .delete(
    '/:id/member/kick/:memberId',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        memberId: z.string(),
      }),
    ),
    async (c) => {
      const { id, memberId } = c.req.valid('param');
      const user = c.get('user');

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.userId, user?.id ?? ''),
      });
      if (!hero) {
        throw new HTTPException(404, { message: 'hero not found' });
      }

      const member = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, memberId),
      });
      if (!member) {
        throw new HTTPException(404, { message: 'member not found' });
      }
      const group = await db.query.groupTable.findFirst({
        where: eq(groupTable.id, id),
      });

      if (!group) {
        throw new HTTPException(404, { message: 'group not found' });
      }

      const isGroupLeader = hero.id === group.leaderId;
      const isSelfKick = hero.id === member.id;
      if (!isGroupLeader) {
        throw new HTTPException(403, { message: 'Only group leader can kick members' });
      }
      if (isSelfKick) {
        throw new HTTPException(403, { message: "You can't kick yourself from the group." });
      }

      const messageData: SocketGroupResponse = {
        message: `${member.name} has been kicked from the group.`,
        groupId: id,
        updateType: 'kick',
        messageType: 'error',
        memberId: member.id,
      };
      await db
        .update(heroTable)
        .set({
          groupId: null,
        })
        .where(eq(heroTable.id, member.id));
      io.to(group.id).emit(socketEvents.groupUpdated(), messageData);

      return c.json<SuccessResponse>({
        message: 'member success kicked the group',
        success: true,
      });
    },
  )
  .delete(
    '/:id/member/leave/:memberId',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        memberId: z.string(),
      }),
    ),
    async (c) => {
      const { id, memberId } = c.req.valid('param');
      const user = c.get('user');

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.userId, user?.id ?? ''),
      });
      if (!hero) {
        throw new HTTPException(404, { message: 'hero not found' });
      }

      const member = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, memberId),
      });
      if (!member) {
        throw new HTTPException(404, { message: 'member not found' });
      }
      const group = await db.query.groupTable.findFirst({
        where: eq(groupTable.id, id),
      });

      if (!group) {
        throw new HTTPException(404, { message: 'group not found' });
      }

      const isCanLeave = hero.id === member.id;

      if (!isCanLeave) {
        throw new HTTPException(403, { message: "You can't leave only yourself." });
      }

      const messageData: SocketGroupResponse = {
        message: `${member.name} has been leave from the group.`,
        groupId: id,
        updateType: 'leave',
        messageType: 'error',
        memberId: member.id,
      };
      await db
        .update(heroTable)
        .set({
          groupId: null,
        })
        .where(eq(heroTable.id, member.id));
      io.to(group.id).emit(socketEvents.groupUpdated(), messageData);

      return c.json<SuccessResponse>({
        message: 'you success leave the group',
        success: true,
      });
    },
  )
  .post(
    '/create/hero/:id',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });
      if (!hero) {
        throw new HTTPException(404, { message: 'hero not found' });
      }
      if (hero.groupId) {
        throw new HTTPException(404, { message: 'is already in a group and cannot be created.' });
      }
      const data = await db.transaction(async (tx) => {
        const [{ groupId }] = await tx
          .insert(groupTable)
          .values({
            id: generateRandomUuid(),
            leaderId: hero.id,
          })
          .returning({ groupId: groupTable.id });
        await tx
          .update(heroTable)
          .set({
            groupId,
          })
          .where(eq(heroTable.id, id));
        return { groupId };
      });

      return c.json<SuccessResponse<typeof data>>(
        {
          message: 'group created',
          success: true,
          data,
        },
        201,
      );
    },
  );
