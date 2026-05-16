import { LogOutButton } from '@/components/LogOutButton';
import { UserAvatar } from '@/components/UserAvatar';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { liteAnimate } from '@/lib/config';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as m from 'motion/react-m';
import { useEffect } from 'react';

import { SignIn } from '../auth/sign-in';

export const Route = createFileRoute('/(home)/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const auth = useAuth();

  useEffect(() => {
    queryClient.removeQueries({
      predicate: (query) => !query.queryKey.includes('user'),
    });
  }, [queryClient]);
  return (
    <m.div variants={liteAnimate} initial="initial" animate="animate" className="flex h-full flex-1 flex-col items-center justify-between">
      <img src="/main-logo.png" className="mx-auto w-full max-w-xl" style={{ imageRendering: 'pixelated' }} />
      {!auth && <SignIn />}
      {!!auth && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="flex max-w-[70px] flex-col items-center">
              <p className="text-muted-foreground line-clamp-1 text-sm">{auth.username} </p>
            </div>
            <UserAvatar url={auth.image} />
            <LogOutButton />
          </div>
          <RainbowButton variant={'default'} onClick={() => navigate({ to: '/game' })} className="h-12 w-full">
            PLAY
          </RainbowButton>
        </div>
      )}
      <div></div>
    </m.div>
  );
}
