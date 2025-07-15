import type { Socket } from 'socket.io';

export const socketHandlers = (socket: Socket) => ({
  joinRoom: (roomId: string) => {
    socket.join(roomId);
  },
  leaveRoom: (roomId: string) => {
    socket.leave(roomId);
  },
});
