import { socketEvents } from '@/shared/socket-events';
import type { Socket } from 'socket.io';

import { socketHandlers } from './socket-handlers';

export const joinRoom = (socket: Socket) => {
  socket.on(socketEvents.joinRoom(), (roomId: string, cb) => {
    socket.join(roomId);
    cb({ accept: true });
  });
};
