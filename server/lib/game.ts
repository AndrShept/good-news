import type { Socket } from 'socket.io';

import { regeneration } from './regenaration';
import { inviteParty } from './inviteParty';

interface IGame {
  socket: Socket;
  heroId?: string;
}
export const game = ({ socket }: IGame) => {
  regeneration({ socket });
  inviteParty(socket)
};
