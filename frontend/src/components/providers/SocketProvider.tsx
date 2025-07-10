import React, { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface ISocketContext {
  socket: Socket;
  isConnected: boolean;
}

const URL = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SOCKET_SERVER : 'http://localhost:3000';

const SocketContext = createContext<ISocketContext | null>(null);
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('context not init');
  }
  return context;
};

export const SocketProvider = ({ children, user }: PropsWithChildren<{ user: { id: string; username: string } | undefined }>) => {
  const socket = useMemo(
    () =>
      io(URL, {
        transports: ['websocket'],
        withCredentials: true,
        auth: user,

        autoConnect: false,
      }),
    [user],
  );
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (user) {
      socket.connect();
    }
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket, user]);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
