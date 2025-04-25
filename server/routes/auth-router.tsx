import type { User as UserType } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { password } from 'bun';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import jwt from 'jsonwebtoken';
import { type User, generateId } from 'lucia';
import { AvatarGenerator } from 'random-avatar-generator';
import z from 'zod';

import { type SuccessResponse, loginSchema, registerSchema } from '../../shared/types';
import type { Context } from '../context';
import { db } from '../db/db';
import { userTable } from '../db/schema/auth-schema';
import { SuccessRegister } from '../lib/emails/SuccessRegister';
import { processEnv, sendEmail } from '../lib/utils';
import { lucia } from '../lucia';
import { loggedIn } from '../middleware/loggedIn';

export const authRouter = new Hono<Context>()
  .post('/sighup', zValidator('form', registerSchema), async (c) => {
    const { password, username, email } = c.req.valid('form');

    const existUsername = await db.query.userTable.findFirst({
      where: eq(userTable.username, username),
    });
    const existEmail = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (existUsername) {
      throw new HTTPException(409, {
        message: 'Username already used',
      });
    }
    if (existEmail) {
      throw new HTTPException(409, {
        message: 'Email already used',
      });
    }

    const payload = { password, email, username };
    const token = jwt.sign(payload, processEnv.JWT_SECRET, { expiresIn: '15m' });
    const confirmUrl = `${processEnv.BASE_URL_FRONT}/auth/confirm-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Реєстрація успішна!',
      reactElement: <SuccessRegister url={confirmUrl} />,
    });

    return c.json<SuccessResponse>(
      {
        success: true,
        message: 'email sended ',
      },
      201,
    );
  })
  .post(
    '/confirm',
    zValidator(
      'query',
      z.object({
        token: z.string().min(1),
      }),
    ),
    async (c) => {
      const { token } = c.req.valid('query');

      let verifyToken;
      try {
        verifyToken = jwt.verify(token, processEnv.JWT_SECRET) as {
          username: string;
          email: string;
          password: string;
        };
      } catch (e) {
        return c.text('Invalid or expired token', 400);
      }
      const { email, password, username } = verifyToken;
      const passwordHash = await Bun.password.hash(password);
      const userId = Bun.randomUUIDv7()
      const generator = new AvatarGenerator();
      const randomAvatarUrl = generator.generateRandomAvatar().replace('Circle', 'Transparent');
      const existUsername = await db.query.userTable.findFirst({
        where: eq(userTable.username, username),
      });
      const existEmail = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
      });
      if (existUsername) {
        throw new HTTPException(409, {
          message: 'Username already used',
        });
      }
      if (existEmail) {
        throw new HTTPException(409, {
          message: 'Email already used',
        });
      }
      await db.insert(userTable).values({
        username,
        password_hash: passwordHash,
        id: userId,
        email,
        image: randomAvatarUrl,
      });

      const session = await lucia.createSession(userId, { username });
      const sessionCookie = lucia.createSessionCookie(session.id).serialize();
      c.header('Set-Cookie', sessionCookie, { append: true });
      return c.json<SuccessResponse>({
        message: 'account created',
        success: true,
      });
    },
  )

  .post('/login', zValidator('form', loginSchema), async (c) => {
    const { password, email } = c.req.valid('form');

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });
    if (!existingUser) {
      throw new HTTPException(401, {
        message: 'Incorrect password or email',
      });
    }
    const validPassword = await Bun.password.verify(password, existingUser.password_hash);
    if (!validPassword) {
      throw new HTTPException(401, {
        message: 'Incorrect password or email',
      });
    }

    const session = await lucia.createSession(existingUser.id, { username: existingUser.username });
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
  })
