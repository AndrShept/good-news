import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ErrorResponse } from '../shared/types';

const app = new Hono().basePath('api');

app.get('/', (c) => {
  return c.text('Hello Hono!');
});
app.get('/hi', (c) => {
  return c.text('HIHI Hono!');
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause === "object" && "form" in err.cause
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
        process.env.NODE_ENV === "production"
          ? "Interal Server Error"
          : (err.stack ?? err.message),
    },
    500,
  );
});

export default app;
