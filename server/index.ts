import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ErrorResponse } from '../shared/types';
import { cors } from 'hono/cors';
import type { Context } from './context';
import { authRouter } from './routes/auth';
import { sessionHandler } from './middleware/sessionHandler';
import { postRouter } from './routes/posts';

const app = new Hono<Context>().basePath('api');
app.use('*', cors(), sessionHandler);


//APP ROUTES
app.route('/auth', authRouter);
app.route('/', postRouter);


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
        err.status
      );
    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        process.env.NODE_ENV === 'production'
          ? 'Interal Server Error'
          : err.stack ?? err.message,
    },
    500
  );
});

export default app;
