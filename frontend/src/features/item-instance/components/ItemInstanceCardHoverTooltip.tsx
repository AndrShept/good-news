import { cn } from '@/lib/utils';
import { ItemInstance, ItemTemplate } from '@/shared/types';

import { EquipInfo } from './EquipInfo';
import { ModifierInfoCard } from './ModifierInfoCard';
import { PotionInfo } from './PotionInfo';

type Props = ItemInstance & {
  itemTemplate: ItemTemplate;
};
export const ItemInstanceCardHoverTooltip = (props: Props) => {
  return (
    <>
      <h3 className={cn('truncate text-base capitalize')}>{props.displayName ?? props.itemTemplate.name}</h3>

      <p className="text-muted-foreground">{props.itemTemplate.type.toLocaleLowerCase().replace('_', ' ')}</p>
      {!!props.durability && (
        <div>
          <span className="mr-1"> durability:</span>
          <span className={cn(props.durability.current <= 10 && 'text-red-500')}>{props.durability.current}</span>

          <span>/{props.durability.max}</span>
        </div>
      )}
      {props.itemTemplate.description && <p className="text-muted-foreground text-wrap text-center">{props.itemTemplate.description}</p>}
      <EquipInfo minDamage={props.modifier?.minDamage} maxDamage={props.modifier?.maxDamage} equipInfo={props.itemTemplate.equipInfo} />
      {!!props.itemTemplate.potionInfo && <PotionInfo potionInfo={props.itemTemplate.potionInfo} />}
      <ModifierInfoCard modifiersArgs={[props.modifier ?? {}]} />
    </>
  );
}
