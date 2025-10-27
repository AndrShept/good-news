import type { Socket } from 'socket.io';

import { inviteGroup } from './inviteGroup';
import { joinRoom } from './joinRoom';
import { leaveRoom } from './leaveRoom';

interface IGame {
  socket: Socket;
  heroId?: string;
}
export const game = ({ socket }: IGame) => {
  inviteGroup(socket);
  joinRoom(socket);
  leaveRoom(socket);
};
