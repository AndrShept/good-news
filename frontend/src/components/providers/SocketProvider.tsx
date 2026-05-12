import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
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
  userId,
  heroId,
  username,
}: PropsWithChildren<{ userId: string | undefined; username: string | undefined; heroId?: string }>) => {
  const socket = useMemo(
    () =>
      io(URL, {
        transports: ['websocket'],
        withCredentials: true,
        auth: { userId, username },
        query: { heroId },
        reconnection: true,
        autoConnect: true,
      }),
    [heroId, userId, username],
  );
  const [isConnected, setIsConnected] = useState(socket.connected);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    if (userId) {
      socket.connect();
    }
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
      queryClient.clear();
      navigate({ to: '/' });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [navigate, queryClient, socket, userId]);
  useEffect(() => {
    return () => {
      socket.disconnect(); 
    };
  }, [socket]); 

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
