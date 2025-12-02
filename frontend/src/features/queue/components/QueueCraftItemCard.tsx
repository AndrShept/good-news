import { GameItemImg } from '@/components/GameItemImg';
import { materialConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { CraftItem, QueueCraftItem } from '@/shared/types';
import { X } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';

import { useDeleteQueueCraftItemMutation } from '../hooks/useDeleteQueueCraftItemMutation';

interface Props extends QueueCraftItem {
  craftItemMap: Record<string, CraftItem>;
}

export const QueueCraftItemCard = memo(function QueueCraftItemCard(props: Props) {
  const { mutate, isPending } = useDeleteQueueCraftItemMutation();

  const [timer, setTimer] = useState(new Date(props.completedAt).getTime() - Date.now());

  useEffect(() => {
    setTimer(new Date(props.completedAt).getTime() - Date.now());
  }, [props.completedAt]);

  useEffect(() => {
    if (props.status !== 'PROGRESS') return;
    const id = setInterval(() => {
      setTimer(new Date(props.completedAt).getTime() - Date.now());
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [props.status]);
  return (
    <li
      className={cn('w-22 group relative flex h-auto flex-col items-center justify-center gap-1 overflow-hidden rounded p-1.5', {
        'border-2 border-red-500/5 bg-red-500/5': props.status === 'FAILED',
        'border-2 border-green-500/5 bg-green-500/5': props.status === 'PROGRESS',
        'border-muted/10 bg-muted/10 border-2': props.status === 'PENDING',
        'opacity-80 saturate-50': isPending,
      })}
    >
      <GameItemImg className="size-10" image={props.craftItemMap[props.craftItemId].gameItem?.image} />
      <p className="line-clamp-1 text-sm">{props.craftItemMap[props.craftItemId].gameItem?.name}</p>
      {props.coreMaterialType && (
        <p className={(cn('text-sm'), materialConfig[props.coreMaterialType]?.color)}>{props.coreMaterialType.toLowerCase()}</p>
      )}
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
      <button
        disabled={isPending}
        onClick={() => mutate(props.id)}
        className={cn('absolute inset-0 hidden items-center justify-center bg-black/90 group-hover:flex')}
      >
        <X size={30} className="text-red-500" />
      </button>
    </li>
  );
});
