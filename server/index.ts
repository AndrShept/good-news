import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';

import type { ErrorResponse } from '../shared/types';
import type { Context } from './context';
import { sessionHandler } from './middleware/sessionHandler';
import { authRouter } from './routes/auth-router';
import { postRouter } from './routes/post-router';

const app = new Hono<Context>().basePath('/api');
app.use(logger());
app.use('*', cors(), sessionHandler);

//APP ROUTES
app.route('/auth', authRouter);
app.route('/post', postRouter);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause === 'object' && 'form' in err.cause
              ? err.cause.form === true
              : false,
        },
        err.status,
      );
    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        process.env.NODE_ENV === 'production'
          ? 'Interal Server Error'
          : (err.stack ?? err.message),
    },
    500,
  );
});

export type AppType = typeof app;

export default app;
