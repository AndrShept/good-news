import { cn, getTimeFns } from '@/lib/utils';
import { useGameMessages } from '@/store/useGameMessages';
import React, { useEffect, useRef } from 'react';

import { ScrollArea } from './ui/scroll-area';

export const GameMessageList = () => {
  const gameMessages = useGameMessages((state) => state.gameMessages);
  const ref = useRef<null | HTMLUListElement>(null);

  useEffect(() => {
    ref.current?.lastElementChild?.scrollIntoView({
      block: 'nearest',
    });
  }, [gameMessages]);

  return (
    <ul ref={ref} className="flex flex-col pl-2 pt-1">
      {gameMessages.map((message, idx) => {
        const splitWords = message.text.split(' ');
        return (
          <div
            key={(message.createdAt?.toString() ?? '') + idx}
            className={cn('inline-flex flex-wrap gap-1 text-sm', {
              'text-foreground': message.color === 'FOREGROUND',
              'text-muted-foreground': message.color === 'GREY',
              'text-yellow-300': message.color === 'YELLOW',
              'text-red-400': message.color === 'RED',
              'text-green-400': message.color === 'GREEN',
              'text-blue-400': message.color === 'BLUE',
              'text-purple-500': message.color === 'PURPLE',
            })}
          >
            <time className="text-foreground">{getTimeFns(message.createdAt!)} </time>
            {splitWords.map((word, idx) => (
              <span
                key={word + idx}
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
  );
};
