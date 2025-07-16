import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { socketEvents } from '@/shared/socket-events';
import { useEffect, useRef, useState } from 'react';

type IAcceptPartyResponse = (params: { accept: boolean }) => void;
type IPartyLeader = {
  name: string;
  level: number;
  avatarImage: string;
};

export const usePartyInviteListener = () => {
  const heroId = useHero((state) => state?.data?.id ?? '');
  const responseCb = useRef<null | IAcceptPartyResponse>(null);
  const partyLeader = useRef<null | IPartyLeader>(null);
  const [isShow, setIsShow] = useState(false);
  const { socket } = useSocket();

  const onClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const groupListener = (data: IPartyLeader, acceptPartyResponse: IAcceptPartyResponse) => {
      console.log(data)
      responseCb.current = acceptPartyResponse;
      partyLeader.current = data;
      setIsShow(true);
 
    };
    socket.on(socketEvents.groupInvited(heroId), groupListener);
    return () => {
      socket.off(socketEvents.groupInvited(heroId), groupListener);
    };
  }, [heroId, socket]);

  return {
    responseCb,
    partyLeader,
    isShow,
    onClose,
  };
};
