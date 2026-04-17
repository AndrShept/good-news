import { ScrollArea } from '@/components/ui/scroll-area';
import { useGroupListener } from '@/features/group/hooks/useGroupListener';
import { useHeroListener } from '@/features/hero/hooks/useHeroListener';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { useSelfMessage } from '@/features/hero/hooks/useSelfMessage';
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

  useEffect(() => {
    ref.current?.lastElementChild?.scrollIntoView({
      block: 'nearest',
    });
  }, [gameMessages]);

  return (
    <section className="bg-background/80 backdrop-blur-xs h-[250px]">
      <ScrollArea className="h-full p-1">
        <ul ref={ref} className="flex flex-col pl-2 pt-1">
          {gameMessages.map((message, idx) => {
            const splitWords = message.text.split(' ');
            return (
              <div
                key={(message.createdAt?.toString() ?? '') + idx}
                className={cn('inline-flex flex-wrap gap-1 text-sm', {
                  'text-muted-foreground': message.color === 'GREY',
                  'text-yellow-300': message.color === 'YELLOW',
                  'text-red-400': message.color === 'RED',
                  'text-green-400': message.color === 'GREEN',
                  'text-blue-400': message.color === 'BLUE',
                  'text-purple-500': message.color === 'PURPLE',
                  'text-foreground': message.color === 'FOREGROUND',
                })}
              >
                <time className="text-foreground">{getTimeFns(message.createdAt!)} </time>
                {splitWords.map((word) => (
                  <span
                  
                    key={word}
                    className={cn('', {
                      'text-foreground': word.startsWith('+') || (word.startsWith('[') && word.endsWith(']')),
                      'text-yellow-300': word.startsWith('x'),
                      'text-purple-500': word.toLowerCase() === 'exp',
                    })}
                  >
                    {word}
                  </span>
                ))}
                {!!message.data?.length && (
                  <ul className="text-foreground inline-flex flex-wrap gap-0.5">
                    [
                    {message.data.map((m, idx) => (
                      <li key={`${message.createdAt}-${m.name}-${idx}`}>
                        <span className="">{m.name}</span>
                        {!!m.quantity && <span className="ml-1 text-yellow-300">{`x${m.quantity}`}</span>}
                        {!!m.quantity && (message.data?.length ?? 1) > 1 && <span className="mr-0.5">,</span>}
                      </li>
                    ))}
                    ]
                  </ul>
                )}
              </div>
            );
          })}
        </ul>
      </ScrollArea>
    </section>
  );
});
