import { ScrollArea } from '@/components/ui/scroll-area';
import { useGroupListener } from '@/features/group/hooks/useGroupListener';
import { useMapListener } from '@/features/map/hooks/useMapListener';
import { usePlaceListener } from '@/features/place/hooks/usePlaceListener';
import { cn, getTimeFns } from '@/lib/utils';
import { useGameMessages } from '@/store/useGameMessages';
import { memo, useEffect, useRef } from 'react';

export const GameMessage = memo(() => {
  const gameMessages = useGameMessages((state) => state.gameMessages);
  const ref = useRef<null | HTMLUListElement>(null);
  useGroupListener();
  useMapListener();
  usePlaceListener();

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
                'text-red-400': message.type === 'success' || !message.success,
                'text-green-400': message.type === 'success',
                'text-muted-foreground': message.type === 'info',
                'text-yellow-400': message.type === 'warning',
              })}
            >
              <time className="text-primary">{getTimeFns(message.createdAt!)}</time>
              <span>{message.text}</span>
              <span
              
              >
                <span className="text-primary">{message.data?.gameItem?.name}</span>
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </section>
  );
});
