import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useEffect, useRef, useState } from 'react';

type IAcceptPartyResponse = (params: { accept: boolean }) => void;
type IPartyLeader = {
  name: string;
  level: number;
  avatarImage: string;
};

export const usePartyInviteListener = () => {
  const heroId = useHero((state) => state?.data?.id ?? '');
  const refFn = useRef<null | IAcceptPartyResponse>(null);
  const partyLeader = useRef<null | IPartyLeader>(null);
  const [isShow, setIsShow] = useState(false);
  const { socket } = useSocket();

  const onClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    socket.on(`invite-party-${heroId}`, (data: IPartyLeader, acceptPartyResponse: IAcceptPartyResponse) => {
      refFn.current = acceptPartyResponse;
      partyLeader.current = data;
      setIsShow(true);
    });
  }, [heroId, socket]);

  return {
    refFn,
    partyLeader,
    isShow,
    onClose,
  };
};
