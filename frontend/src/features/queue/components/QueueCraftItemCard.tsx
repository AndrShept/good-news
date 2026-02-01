import { GameItemImg } from '@/components/GameItemImg';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { cn } from '@/lib/utils';
import { QueueCraft } from '@/shared/types';
import { X } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';

import { useDeleteQueueCraftItemMutation } from '../hooks/useDeleteQueueCraftItemMutation';

type Props = QueueCraft;

export const QueueCraftItemCard = memo(function QueueCraftItemCard(props: Props) {
  const { mutate, isPending } = useDeleteQueueCraftItemMutation();
  const { itemsTemplateById, recipeTemplateById } = useGameData();
  const recipe = recipeTemplateById[props.recipeId];
  const template = itemsTemplateById[recipe.itemTemplateId];
  const [timer, setTimer] = useState(props.expiresAt - Date.now());

  useEffect(() => {
    setTimer(props.expiresAt - Date.now());
  }, [props.expiresAt]);

  useEffect(() => {
    if (props.status !== 'PROGRESS') return;
    const id = setInterval(() => {
      setTimer(props.expiresAt - Date.now());
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [props.status]);
  return (
    <li
      className={cn(
        'w-26 group relative  flex flex-col h-auto select-none items-center  gap-1  rounded p-1.5',
        {
          'border-2 border-red-500/5 bg-red-500/5': props.status === 'FAILED',
          'border-2 border-green-500/5 bg-green-500/5': props.status === 'PROGRESS',
          'border-muted/10 bg-muted/10 border-2': props.status === 'PENDING',
          'opacity-80 saturate-50': isPending,
        },
      )}
    >
      <GameItemImg image={template.image}  className='size-9'/>
      <div className='flex flex-col items-center '>
        <h2 className=' text-[15px] truncate'>{template.name}</h2>
        <p
          className={cn('text-sm', {
            'text-muted': props.status === 'PENDING',
            'text-green-500': props.status === 'PROGRESS',
            'text-red-500': props.status === 'FAILED',
          })}
        >
          {props.status.toLocaleLowerCase()}
        </p>
        <p
          className={cn('text-sm text-yellow-300 opacity-0', {
            'opacity-100': props.status === 'PROGRESS',
          })}
        >
          {Math.max(0, Math.ceil(timer / 1000))} сек
        </p>
      </div>

      {/* <button
        disabled={isPending}
        onClick={() => mutate({ queueCraftItemId: props.id})}
        className={cn('absolute inset-0 hidden items-center justify-center bg-black/90 group-hover:flex')}
      >
        <X size={30} className="text-red-500" />
      </button> */}
    </li>
  );
});
