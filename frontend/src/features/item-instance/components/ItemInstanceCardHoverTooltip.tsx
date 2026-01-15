import { GameItemImg } from '@/components/GameItemImg';
import { materialConfig } from '@/lib/config';
import { cn, getModifiers } from '@/lib/utils';
import { ItemInstance, ItemTemplate } from '@/shared/types';
import { memo } from 'react';

import { ModifierInfoCard } from './ModifierInfoCard';

type Props = ItemInstance & {
  itemTemplate: ItemTemplate;
};
export const ItemInstanceCardHoverTooltip = memo((props: Props) => {
  const modifiers = getModifiers(props.itemTemplate.coreModifier ?? {}, props.materialModifier ?? {});

  return (
    <li className={cn('flex flex-col gap-4 rounded border p-4 text-start')}>
      <section className="flex gap-4">
        <GameItemImg className="size-10" image={props.itemTemplate.image} />

        <div className="flex flex-col">
          <h3 className="line-clamp-2 text-base capitalize">{props.itemTemplate.name}</h3>
          {props.coreMaterial && (
            <div>
              <span>material: </span>
              <span className={cn(materialConfig[props.coreMaterial]?.color)}>{props.coreMaterial?.split('-')[0]}</span>
            </div>
          )}

          <p className="text-muted-foreground/30 capitalize">{props.itemTemplate.type.toLocaleLowerCase()}</p>
          <ModifierInfoCard modifiers={modifiers} />
        </div>
      </section>
    </li>
  );
});
