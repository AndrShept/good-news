import { changeHeroOnlineStatus } from '@/features/hero/api/change-status';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { client } from '@/lib/utils';
import React, { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface ISocketContext {
  socket: Socket;
  isConnected: boolean;
}

const URL = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SOCKET_SERVER : 'http://localhost:3000';

const SocketContext = createContext({} as ISocketContext);
export const useSocket = () => {
  const context = useContext(SocketContext);

  return context;
};

export const SocketProvider = ({
  children,
  user,
  heroId,
}: PropsWithChildren<{ user: { id: string; username: string } | undefined; heroId?: string }>) => {
  const socket = useMemo(
    () =>
      io(URL, {
        transports: ['websocket'],
        withCredentials: true,
        auth: user,
        query: { heroId },

        autoConnect: false,
      }),
    [heroId, user],
  );
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (user) {
      socket.connect();
    }
    function onConnect() {
      setIsConnected(true);
      changeHeroOnlineStatus({
        heroId,
        status: {
          isOnline: true,
        },
      });
    }

    async function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [heroId, socket, user]);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
