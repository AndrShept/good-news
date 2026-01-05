import type { ErrorResponse, MapHero } from '@/shared/types';
import { serve } from '@hono/node-server';
import { createAdapter } from '@socket.io/redis-adapter';
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { Server } from 'socket.io';

import { type Context } from './context';
import { db } from './db/db';
import { heroTable } from './db/schema';
import { gameLoop } from './game/gameLoop';
import { saveDb } from './game/save-db';
import { serverState } from './game/state/hero-state';
import { heroOffline } from './lib/heroOffline';
import { inviteGroup } from './lib/inviteGroup';
import { joinRoom } from './lib/joinRoom';
import { leaveRoom } from './lib/leaveRoom';
import { sessionHandler } from './middleware/sessionHandler';
import { actionQueueListeners } from './queue/actionQueueListeners';
import { authRouter } from './routes/auth-router';
import { commentRouter } from './routes/comment-router';
import { craftRouter } from './routes/craft-router';
import { groupRouter } from './routes/group-router';
import { heroRouter } from './routes/hero-router';
import { mapRouter } from './routes/map-router';
import { placeRouter } from './routes/place-router';
import { postRouter } from './routes/post-router';
import { shopRouter } from './routes/shop-router';
import { locationTable } from './db/schema/location-schema';

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
  .route('/craft', craftRouter);

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
  hostname: '0.0.0.0',
});

actionQueueListeners();

export const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: process.env['BASE_URL_FRONT'],
  },
  pingInterval: 30000, // 30 sec
  pingTimeout: 1000 * 60 * 60 * 24, // 24 h

  transports: ['websocket'],
});

await db.update(heroTable).set({
  isOnline: false,
  state: 'IDLE',

});
await db.update(locationTable).set({
  targetX: null,
  targetY: null,
});

gameLoop();

io.on('connection', async (socket) => {
  const { username } = socket.handshake.auth as { username: string; id: string };
  const { heroId } = socket.handshake.query as { heroId: string };

  socket.join(heroId);
  inviteGroup(socket);
  joinRoom(socket);
  leaveRoom(socket);

  console.info('connected ' + username);
  socket.on('disconnect', async () => {
    console.info('disconnect ' + username);
    const heroState = serverState.hero.get(heroId);
    if (heroState) {
      heroState.offlineTimer = Date.now() + 30000;
    }
   
  });
});

console.info('Server Running on port 🚀', process.env['PORT'] || 3000);
