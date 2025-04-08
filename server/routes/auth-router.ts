import type { User as UserType } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { type User, generateId } from 'lucia';
import postgres from 'postgres';
import { AvatarGenerator } from 'random-avatar-generator';

import { type SuccessResponse, loginSchema } from '../../shared/types';
import type { Context } from '../context';
import { db } from '../db/db';
import { userTable } from '../db/schema/auth-schema';
import { lucia } from '../lucia';
import { loggedIn } from '../middleware/loggedIn';

export const authRouter = new Hono<Context>()
  .post('/sighup', zValidator('form', loginSchema), async (c) => {
    const { password, username } = c.req.valid('form');
    const passwordHash = await Bun.password.hash(password);
    const userId = generateId(15);
    const generator = new AvatarGenerator();
    const randomAvatarUrl = generator.generateRandomAvatar().replace('Circle', 'Transparent');

    const existUsername = await db.query.userTable.findFirst({
      where: eq(userTable.username, username),
    });

    if (existUsername) {
      throw new HTTPException(409, {
        message: 'Username already used',
      });
    }

    await db.insert(userTable).values({
      username,
      password_hash: passwordHash,
      id: userId,
      image: randomAvatarUrl,
    });

    const session = await lucia.createSession(userId, { username });
    const sessionCookie = lucia.createSessionCookie(session.id).serialize();
    c.header('Set-Cookie', sessionCookie, { append: true });
    return c.json<SuccessResponse>(
      {
        success: true,
        message: 'User created',
      },
      201,
    );
  })

  .post('/login', zValidator('form', loginSchema), async (c) => {
    const { password, username } = c.req.valid('form');
    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.username, username),
    });
    if (!existingUser) {
      throw new HTTPException(401, {
        message: 'Incorrect username',
      });
    }
    const validPassword = await Bun.password.verify(password, existingUser.password_hash);
    if (!validPassword) {
      throw new HTTPException(401, {
        message: 'Incorrect password',
      });
    }

    const session = await lucia.createSession(existingUser.id, { username });
    const sessionCookie = lucia.createSessionCookie(session.id).serialize();
    c.header('Set-Cookie', sessionCookie, { append: true });
    return c.json<SuccessResponse<User>>(
      {
        success: true,
        message: 'Logged in',
        data: existingUser,
      },
      200,
    );
  })

  .get('/logout', async (c) => {
    const session = c.get('session');
    if (!session) {
      return c.redirect('/');
    }
    await lucia.invalidateSession(session.id);
    c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
    return c.redirect('/');
  })

  .get('/user', loggedIn, async (c) => {
    const userId = c.get('user')?.id;
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId!),
      with: {},
    });
    return c.json<SuccessResponse<UserType>>({
      success: true,
      message: 'User fetched',
      data: user,
    });
  });
