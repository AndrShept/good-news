import { socketEvents } from '@/shared/socket-events';
import type { Socket } from 'socket.io';

export const leaveRoom = (socket: Socket) => {
  socket.on(socketEvents.leaveRoom(), (roomId: string, cb) => {
    socket.leave(roomId);
    cb({ accept: true });
  });
};
