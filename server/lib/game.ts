import type { Socket } from 'socket.io';

import { inviteGroup } from './inviteGroup';
import { regeneration } from './regenaration';

interface IGame {
  socket: Socket;
  heroId?: string;
}
export const game = ({ socket }: IGame) => {
  regeneration({ socket });
  inviteGroup(socket);
};
