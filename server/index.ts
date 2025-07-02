import { serve } from '@hono/node-server';
import 'dotenv/config';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import type { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';
import type { Context } from './context';
import { game } from './lib/game';
import { sessionHandler } from './middleware/sessionHandler';
import { authRouter } from './routes/auth-router';
import { commentRouter } from './routes/comment-router';
import { heroRouter } from './routes/hero-router';
import { postRouter } from './routes/post-router';
import { shopRouter } from './routes/shop-router';

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
  .route('/shop', shopRouter);

// app.onError((err, c) => {
//   // Обробка помилки підключення до бази даних
//   console.log('err',err)
//   console.log('c',c)
//   if (err instanceof Error && 'code' in err && err.code === 'ECONNREFUSED') {
//     return c.json<ErrorResponse>(
//       {
//         success: false,
//         message: 'Database connection failed. Please try again later.',
//       },
//       503, // 503 Service Unavailable
//     );
//   }

//   // return c.json<ErrorResponse>(
//   //   {
//   //     success: false,
//   //     message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.stack ?? err.message),
//   //   },
//   //   500,
//   // );
//   throw new HTTPException(405, { message: err.message || 'OOPPPSS' });
// });
export type ApiRoutes = typeof routes;

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

const httpServer = serve({
  fetch: app.fetch,
  port: 3000,
  hostname: '0.0.0.0',
});

const io = new Server(httpServer as HTTPServer, {
  cors: {
    credentials: true,
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('user connected', socket.handshake.headers['username']);
  const heroId = socket.handshake.headers['heroid'] as string | undefined;
  if (heroId) {
    console.log('@@@@@@@@');
    game({ socket, heroId });
  }

  socket.on('disconnect', () => {
    console.log('disconnect ' + socket.handshake.headers['username']);
  });
});

// export default {
//   port: process.env['PORT'] || 3000,
//   hostname: '0.0.0.0',
//   fetch: app.fetch,
// };
console.log('Server Running on port 🚀', process.env['PORT'] || 3000);
