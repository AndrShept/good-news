import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { socketEvents } from '@/shared/socket-events';
import { useEffect, useRef, useState } from 'react';

type IAcceptGroupCb = (params: { accept: boolean }) => void;
type IResponseData = {
  name: string;
  level: number;
  avatarImage: string;
  waitTime: number;
  groupId: string
};

export const usePartyInviteListener = () => {
  const heroId = useHero((state) => state?.data?.id ?? '');
  const responseCb = useRef<null | IAcceptGroupCb>(null);
  const responseData = useRef<null | IResponseData>(null);
  const [isShow, setIsShow] = useState(false);
  const { socket } = useSocket();

  const onClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const groupListener = (data: IResponseData, acceptPartyResponse: IAcceptGroupCb) => {
      responseCb.current = acceptPartyResponse;
      responseData.current = data;
      setIsShow(true);
    };
    socket.on(socketEvents.groupInvited(heroId), groupListener);
    return () => {
      socket.off(socketEvents.groupInvited(heroId), groupListener);
    };
  }, [heroId, socket]);

  return {
    responseCb,
    responseData,
    isShow,
    onClose,
  };
};
