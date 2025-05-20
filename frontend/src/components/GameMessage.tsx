import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, getRarityColor, getTimeFns } from '@/lib/utils';
import { GameItem } from '@/shared/types';
import { useGameMessages } from '@/store/useGameMessages';
import { useEffect, useRef } from 'react';

export const GameMessage = () => {
  const ref = useRef<null | HTMLUListElement>(null);
  const gameMessages = useGameMessages((state) => state.gameMessages);

  console.log(gameMessages);
  useEffect(() => {
    ref.current?.lastElementChild?.scrollIntoView({
      block: 'nearest',
    });
  }, [gameMessages]);
  return (
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
              className={cn(
                '',
                message.success && {
                  ...getRarityColor('COMMON'),
                },
              )}
            >
              <span className="text-primary">{message.data?.gameItem?.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};
