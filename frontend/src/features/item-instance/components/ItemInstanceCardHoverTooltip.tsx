import { materialConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { ItemInstance, ItemTemplate } from '@/shared/types';
import { memo } from 'react';

import { EquipInfo } from './EquipInfo';
import { ModifierInfoCard } from './ModifierInfoCard';
import { PotionInfo } from './PotionInfo';

type Props = ItemInstance & {
  itemTemplate: ItemTemplate;
};
export const ItemInstanceCardHoverTooltip = memo((props: Props) => {
  return (
    <section className={cn('bg-secondary/80 flex max-w-sm flex-col items-center justify-center truncate rounded border px-4 py-2')}>
      <h3 className={cn('truncate text-base capitalize', props.coreResource && materialConfig[props.coreResource]?.color)}>
        {props.displayName ?? props.itemTemplate.name}
      </h3>

      <p className="text-muted-foreground">{props.itemTemplate.type.toLocaleLowerCase().replace('_', ' ')}</p>
      {!!props.durability && (
        <div>
          <span className="mr-1"> durability:</span>
          <span className={cn(props.durability.current <= 10 && 'text-red-500')}>{props.durability.current}</span>

          <span>/{props.durability.max}</span>
        </div>
      )}
      {props.itemTemplate.description && <p className="text-muted-foreground text-wrap text-center">{props.itemTemplate.description}</p>}
      <EquipInfo
        minDamage={props.itemTemplate.coreModifier?.minDamage}
        maxDamage={props.itemTemplate.coreModifier?.maxDamage}
        equipInfo={props.itemTemplate.equipInfo}
      />
      {!!props.itemTemplate.potionInfo && <PotionInfo potionInfo={props.itemTemplate.potionInfo} />}
      <ModifierInfoCard modifiersArgs={[props.itemTemplate.coreModifier, props.coreResourceModifier ?? {}]} />
    </section>
  );
});
