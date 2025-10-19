import type { ErrorResponse } from '@/shared/types';
import { serve } from '@hono/node-server';
import { createAdapter } from '@socket.io/redis-adapter';
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { Redis } from 'ioredis';
import type { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';

import { type Context } from './context';
import { db } from './db/db';
import { actionTable, heroTable } from './db/schema';
import { game } from './lib/game';
import { heroOffline } from './lib/heroOffline';
import { sessionHandler } from './middleware/sessionHandler';
import { actionQueueListeners } from './queue/actionQueueListeners';
import { authRouter } from './routes/auth-router';
import { commentRouter } from './routes/comment-router';
import { groupRouter } from './routes/group-router';
import { heroRouter } from './routes/hero-router';
import { mapRouter } from './routes/map-router';
import { placeRouter } from './routes/place-router';
import { postRouter } from './routes/post-router';
import { shopRouter } from './routes/shop-router';
import { tileRouter } from './routes/tile-router';

const app = new Hono<Context>();

app.use(logger());
app.use('*', cors(), sessionHandler);

//APP ROUTES
const routes = app
  .basePath('/api')
  .route('/auth', authRouter)
  .route('/post', postRouter)
  .route('/comment', commentRouter)
  .route('/hero', heroRouter)
  .route('/shop', shopRouter)
  .route('/group', groupRouter)
  .route('/map', mapRouter)
  .route('/place', placeRouter)
  .route('/tile', tileRouter);

app.onError((err, c) => {
  // Обробка помилки підключення до бази даних
  if (err instanceof Error && 'code' in err && err.code === 'ECONNREFUSED') {
    return c.json<ErrorResponse>(
      {
        success: false,
        message: 'Database connection failed. Please try again later.',
      },
      503, // 503 Service Unavailable
    );
  }

  if (err instanceof HTTPException) {
    return c.json<ErrorResponse>(
      {
        message: err.message,
        success: false,
        canShow: (err.cause as { canShow?: boolean })?.canShow,
      },
      err.status,
    );
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.stack ?? err.message),
    },
    500,
  );
});
export type ApiRoutes = typeof routes;

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

const httpServer = serve({
  fetch: app.fetch,
  port: 3000,
});

actionQueueListeners();

const pubClient = new Redis(process.env['REDIS_CLOUD_DATABASE_URL']!);
const subClient = pubClient.duplicate();

export const io = new Server(httpServer as HTTPServer, {
  cors: {
    credentials: true,
    origin: process.env['BASE_URL_FRONT'],
  },
  adapter: createAdapter(pubClient, subClient),
});

await db.update(heroTable).set({
  isOnline: false,
});
await db.update(actionTable).set({
  type: 'IDLE',
});

io.on('connection', async (socket) => {
  const { username } = socket.handshake.auth as { username: string; id: string };
  const { heroId } = socket.handshake.query as { heroId: string };
  socket.join(heroId);
  game({ socket });
  console.info('connected ' + username);
  socket.on('disconnect', () => {
    console.info('disconnect ' + username);
    heroOffline(heroId);
  });
});

console.info('Server Running on port 🚀', process.env['PORT'] || 3000);
