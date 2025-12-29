import { ScrollArea } from '@/components/ui/scroll-area';
import { useGroupListener } from '@/features/group/hooks/useGroupListener';
import { useHeroListener } from '@/features/hero/hooks/useHeroListener';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { useSelfMessage } from '@/features/hero/hooks/useSelfMessage';
import { useWalkMapListener } from '@/features/hero/hooks/useWalkMapListener';
import { useMapListener } from '@/features/map/hooks/useMapListener';
import { usePlaceListener } from '@/features/place/hooks/usePlaceListener';
import { useQueueCraftListener } from '@/features/queue/hooks/useQueueCraftListener';
import { cn, getTimeFns } from '@/lib/utils';
import { useGameMessages } from '@/store/useGameMessages';
import { memo, useEffect, useRef } from 'react';

export const GameMessage = memo(() => {
  const gameMessages = useGameMessages((state) => state.gameMessages);
  const ref = useRef<null | HTMLUListElement>(null);
  useGroupListener();
  useMapListener();
  usePlaceListener();
  useRegeneration();
  useSelfMessage();
  useHeroListener();
  useQueueCraftListener();
  useWalkMapListener();

  useEffect(() => {
    ref.current?.lastElementChild?.scrollIntoView({
      block: 'nearest',
    });
  }, [gameMessages]);

  return (
    <section className="bg-background/80 backdrop-blur-xs h-[250px]">
      <ScrollArea className="h-full p-1">
        <ul ref={ref} className="flex flex-col pl-2 pt-1">
          {gameMessages.map((message) => (
            <li
              key={message.createdAt!.toString()}
              className={cn('space-x-1 text-sm text-green-400', {
                'text-red-400': message.type === 'ERROR',
                'text-green-400': message.type === 'SUCCESS',
                'text-muted-foreground': message.type === 'INFO',
                'text-yellow-400': message.type === 'WARNING',
                'text-blue-400': message.type === 'SKILL_EXP',
                'text-purple-500': message.type === 'LEVEL_EXP',
              })}
            >
              <time className="text-primary">{getTimeFns(message.createdAt!)}</time>
              <span>{message.text}</span>
              <span className="text-primary">{message.data?.gameItemName}</span>
              {!!message.data?.quantity && <span className="text-yellow-300">{`x${message.data?.quantity}`}</span>}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </section>
  );
});
