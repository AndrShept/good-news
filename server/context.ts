import type { Env } from 'hono';
import type { Session, User } from 'lucia';
import type { Socket } from 'socket.io';

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
    socket: Socket | null;
  };
}

