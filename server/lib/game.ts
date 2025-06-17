import type { Socket } from 'socket.io';

import { regeneration } from './regenaration';

interface IGame {
  socket: Socket;
  heroId: string;
}
export const game = ({ socket, heroId }: IGame) => {
  regeneration({ socket, heroId });
};
