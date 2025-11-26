
import { ApiGetCraftItemResponse, ArmorType, CraftItem, WeaponType } from '@/shared/types';
import { memo } from 'react';

import { SelectBaseResource } from './CraftSelectResource';

interface Props {
  data: ApiGetCraftItemResponse;
  onSelect: (item: CraftItem) => void;
  selectedItemId: string | undefined;
}

export const CraftSidebar = memo(({ data, onSelect, selectedItemId }: Props) => {
  return (
    <aside className="flex w-full max-w-[150px] flex-col  md:max-w-[200px] ">
      <ul className=''>{data?.craftItems.map((craftItem) => <div onClick={() => onSelect(craftItem)}>{craftItem.gameItem?.name}</div>)}</ul>
      <div className="mt-auto">{!!data?.resources.length && <SelectBaseResource resources={data?.resources} />}</div>
    </aside>
  );
});
