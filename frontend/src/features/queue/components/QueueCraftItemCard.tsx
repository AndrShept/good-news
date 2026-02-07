import { GameItemImg } from '@/components/GameItemImg';
import { Button } from '@/components/ui/button';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { materialConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { CoreResourceType, QueueCraft } from '@/shared/types';
import { X } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';

import { useDeleteQueueCraftItemMutation } from '../hooks/useDeleteQueueCraftItemMutation';

type Props = QueueCraft;

export const QueueCraftItemCard = memo(function QueueCraftItemCard(props: Props) {
  const { mutate, isPending } = useDeleteQueueCraftItemMutation();
  const { itemsTemplateById, recipeTemplateById } = useGameData();
  const recipe = recipeTemplateById[props.recipeId];
  const template = itemsTemplateById[recipe.itemTemplateId];
  const coreResource = props.coreResourceId && itemsTemplateById[props.coreResourceId];
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
      className={cn('w-25 group relative flex h-auto select-none flex-col items-center gap-1 rounded px-2 py-3', {
        // 'border-2 border-green-500/5 bg-green-500/5': props.status === 'PROGRESS',
        // 'border-muted/10 bg-muted/10 border-2': props.status === 'PENDING',
        // 'opacity-80 saturate-50': isPending,
      })}
    >
      <GameItemImg image={template.image} className="size-10" />
      <div className="flex flex-col items-center">
        <h2 className="truncate text-[15px]">{template.name}</h2>
        {coreResource && <p className={cn('text-xs truncate', materialConfig[coreResource.key as CoreResourceType]?.color)}>{coreResource.name}</p>}
        <p
          className={cn('text-sm', {
            'text-muted': props.status === 'PENDING',
            'text-green-500': props.status === 'PROGRESS',
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

      <Button
        variant={'ghost'}
        size="icon"
        disabled={isPending}
        onClick={() => mutate({ queueCraftItemId: props.id })}
        className={cn('absolute right-0.5 top-1 size-6 p-1 text-red-500/40 hover:bg-transparent hover:text-red-500/60')}
      >
        <X className="size-6" />
      </Button>
    </li>
  );
});
