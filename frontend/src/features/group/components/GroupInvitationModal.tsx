import { HeroAvatar } from '@/components/HeroAvatar';
import { TimerBar } from '@/components/TimerBar';
import { Button } from '@/components/ui/button';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { useHero } from '@/features/hero/hooks/useHero';
import { useQueryClient } from '@tanstack/react-query';
import * as m from 'motion/react-m';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { getGroupMembersOptions } from '../api/get-group-members';
import { usePartyInviteListener } from '../hooks/usePartyInviteListener';

export const GroupInvitationModal = () => {
  const { isShow, onClose, responseData, responseCb } = usePartyInviteListener();
  const [isLoading, setIsLoading] = useState(false);
  const groupId = useHero((state) => state?.data?.groupId ?? '');
  const queryClient = useQueryClient();
  const seconds = useRef(0);
  const onAccept = async () => {
    setIsLoading(true);
    responseCb.current?.({ accept: true });
    await new Promise((r) => setTimeout(r, 1000));
    await queryClient.invalidateQueries({
      queryKey: getHeroOptions().queryKey,
    });
    await queryClient.invalidateQueries({
      queryKey: getGroupMembersOptions(groupId).queryKey,
    });
    setIsLoading(false);
    onClose();
  };
  const onDecline = () => {
    responseCb.current?.({ accept: false });
    onClose();
  };

  useEffect(() => {
    if (!isShow) return;
    seconds.current = responseData.current?.waitTime ?? 5_000;
    const timer = setInterval(() => {
      if (seconds.current <= 1000) {
        clearInterval(timer);
        onClose();
      }
      seconds.current -= 1000;
    }, 1000);
    return () => clearInterval(timer);
  }, [responseData.current, isShow]);

  if (!isShow) return;
  return createPortal(
    <section className="fixed inset-0 z-50 flex overflow-hidden p-2">
      <m.div
        initial={{
          opacity: 0.5,
          scale: 0.8,
          y: -100,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 10,
        }}
        className="bg-background mx-auto flex h-fit w-full max-w-[350px] flex-col gap-4 rounded-md border p-4"
      >
        <div className="flex gap-2">
          <div className="flex flex-col items-center gap-0.5">
            <HeroAvatar src={responseData.current?.avatarImage ?? ''} />

            <p className="text-[15px] text-green-500">level {responseData.current?.level}</p>
          </div>
          <p className="text-[15px]">
            <span className="text-yellow-300">{responseData.current?.name}</span> has invited you to join their group.{' '}
            <span className="text-muted-foreground">Do you accept the invitation?</span>
          </p>
        </div>
        <div>
          <TimerBar second={responseData.current?.waitTime} />
        </div>
        <div className="ml-auto mt-auto flex gap-2">
          <Button disabled={isLoading} size="sm" variant="default" onClick={onAccept}>
            Accept
          </Button>
          <Button size="sm" variant="outline" onClick={onDecline}>
            Decline
          </Button>
        </div>
      </m.div>
    </section>,
    document.body,
  );
};
