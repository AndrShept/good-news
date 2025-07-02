import { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const URL = import.meta.env.SOCKET_SERVER || 'http://localhost:3000';

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket context not found');
  return context;
};

interface SocketProviderProps {
  user: {
    id: string;
    username: string;
  };
  heroId: string;
  children: ReactNode;
}

export const SocketProvider = ({ user, heroId, children }: SocketProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user || !heroId) return;

    if (!socketRef.current) {
      socketRef.current = io(URL, {
        extraHeaders: {
          userId: user.id,
          username: user.username,
          heroId,
        },
        auth: {
          userId: user.id,
        },
      });

      socketRef.current.on('connect', () => setIsConnected(true));
      socketRef.current.on('disconnect', () => setIsConnected(false));
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user.id, user.username, heroId]);

  const contextValue = useMemo(
    () => ({
      isConnected,
      socket: socketRef.current,
    }),
    [isConnected]
  );

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};
