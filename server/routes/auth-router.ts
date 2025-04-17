import type { User as UserType } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { type User, generateId } from 'lucia';
import nodemailer from 'nodemailer';
import { AvatarGenerator } from 'random-avatar-generator';
import z from 'zod';

import { type SuccessResponse, loginSchema, registerSchema } from '../../shared/types';
import type { Context } from '../context';
import { db } from '../db/db';
import { userTable } from '../db/schema/auth-schema';
import { lucia } from '../lucia';
import { loggedIn } from '../middleware/loggedIn';

export const authRouter = new Hono<Context>()
  .post('/sighup', zValidator('form', registerSchema), async (c) => {
    const { password, username, email } = c.req.valid('form');
    console.log(password, username, email);
    const passwordHash = await Bun.password.hash(password);
    const userId = generateId(15);
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

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587, // або 465 для SSL
      secure: false, // true якщо порт 465
      auth: {
        user: '8a9cd7001@smtp-brevo.com',
        pass: 'JmO7EKrFj9HUfWan',
      },
    });

    await transporter.sendMail({
      from: '"Good News" <no-reply@good-news.space>', // рекомендовано свій домен
      to: email,
      subject: 'Реєстрація успішна!',
      text: 'Дякуємо за реєстрацію!',
      html: '<h1>Дякуємо за реєстрацію!</h1><p>Тепер ви з нами 🙌</p>',
    });

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
    return c.json<SuccessResponse>(
      {
        success: true,
        message: 'User created',
      },
      201,
    );
  })

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
  });
