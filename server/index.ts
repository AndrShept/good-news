import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { hc } from 'hono/client';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';

import type { ErrorResponse } from '../shared/types';
import type { Context } from './context';
import { sessionHandler } from './middleware/sessionHandler';
import { authRouter } from './routes/auth-router';
import { commentRouter } from './routes/comment-router';
import { postRouter } from './routes/post-router';

const app = new Hono<Context>();
app.use(logger());
app.use('*', cors(), sessionHandler);

//APP ROUTES
const routes = app.basePath('/api').route('/auth', authRouter).route('/post', postRouter).route('/comment', commentRouter);
const client = hc<typeof routes>('/');

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

export default {
  port: process.env['PORT'] || 3000,
  hostname: '0.0.0.0',
  fetch: app.fetch,
};
console.log('Server Running on port', process.env['PORT'] || 3000);
