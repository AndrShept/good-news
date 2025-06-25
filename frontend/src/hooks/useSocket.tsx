import { useAuth } from '@/features/auth/hooks/useAuth';
import { useHero } from '@/features/hero/hooks/useHero';
import { User } from '@/shared/types';
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const URL = import.meta.env.SOCKET_SERVER || 'http://localhost:3000';
// const URL = 'https://good-news.space'

interface SocketContextProps {
  socket: null | Socket;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});
 export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket context not found');
  }
  return context;
};

 export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<null | Socket>(null);
  const user = useAuth();
  const { id: heroId } = useHero();

  useEffect(() => {
    if (!user) return;
    if (!heroId) return;
    const socketInstance = io(URL, {
      extraHeaders: {
        userId: user.id,
        username: user.username,
        heroId,
      },
      auth: {
        userId: user.id,
      },
    });

    const onConnect = async () => {
      setIsConnected(true);
      socketRef.current = socketInstance;
      // await userOnline();
    };
    const onDisconnect = async () => {
      setIsConnected(false);
    };
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
    };
  }, [heroId, user, user?.id, user?.username]);

  return <SocketContext.Provider value={{ isConnected, socket: socketRef.current }}>{children}</SocketContext.Provider>;
};
