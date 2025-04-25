import { serve } from '@hono/node-server';
import 'dotenv/config';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { hc } from 'hono/client';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import type { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';

import type { ErrorResponse } from '../shared/types';
import type { Context } from './context';
import { processEnv } from './lib/utils';
import { sessionHandler } from './middleware/sessionHandler';
import { authRouter } from './routes/auth-router';
import { commentRouter } from './routes/comment-router';
import { postRouter } from './routes/post-router';

const app = new Hono<Context>();

app.use(logger());
app.use('*', cors(), sessionHandler);

//APP ROUTES
const routes = app.basePath('/api').route('/auth', authRouter).route('/post', postRouter).route('/comment', commentRouter);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json<ErrorResponse>(
      {
        success: false,
        message: err.message,
        isFormError: err instanceof HTTPException && 'cause' in err ? true : false,
      },
      err.status,
    );
  }

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

const io = new Server(httpServer as HTTPServer, {
  cors: {
    credentials: true,
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('user connected', socket.handshake.headers['username']);

  socket.on('test', (data) => {
    console.log(data);
    socket.emit('test', data)
  });

  socket.on('disconnect', () => {
    console.log('disconnect ' + socket.handshake.headers['username']);
  });
});

// export default {
//   port: process.env['PORT'] || 3000,
//   hostname: '0.0.0.0',
//   fetch: app.fetch,
// };
console.log('Server Running on port', process.env['PORT'] || 3000);
