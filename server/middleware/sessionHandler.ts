import type { Context, Next } from 'hono';

import { lucia } from '../lucia';

export const sessionHandler = async (c: Context, next: Next) => {
  const sessionId = lucia.readSessionCookie(c.req.header('Cookie') ?? '');
  if (!sessionId) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }
  if (!session) {
    c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  c.set('session', session);
  c.set('user', user);
  return next();
};
