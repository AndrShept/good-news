import { getHeroOptions } from '@/features/hero/api/get-hero';
import { useHero } from '@/features/hero/hooks/useHero';
import { getMapHeroesLocation } from '@/features/map/api/get-map-heroes';
import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

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
        reconnection: true,
        autoConnect: true,
      }),
    [heroId, user],
  );
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { refetch } = useQuery(getHeroOptions());

  useEffect(() => {
    if (user) {
      socket.connect();
    }
    function onConnect() {
      setIsConnected(true);
      refetch();
    }

    async function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    return () => {
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [heroId, refetch, socket, user]);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
