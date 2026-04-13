import { GameIcon } from '@/components/GameIcon';
import { GameItemImg } from '@/components/GameItemImg';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { TINT_COLOR } from '@/lib/config';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { ColoredResourceType, NPC, NPCSellItem } from '@/shared/types';
import { useNpcStore } from '@/store/useNpcStore';
import { useShopItemStore } from '@/store/useShopItemStore';
import { useEffect, useMemo } from 'react';

import { ShopAvatar } from './ShopAvatar';
import { ShopItemCart } from './ShopItemCart';

interface Props {
  sellItems: NPCSellItem[];
  npc: NPC;
}

export const NpcBuy = ({ sellItems, npc }: Props) => {
  const items = useShopItemStore((state) => state.items);
  const addShopItem = useShopItemStore((state) => state.addShopItem);
  const { setNpcActiveTab, getEmptyMessage } = useNpcStore();

  const itemsMap = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [items]);
  const { itemsTemplateById } = useGameData();
  useEffect(() => {
    if (!sellItems?.length) {
      setNpcActiveTab(null);
      getEmptyMessage({ npcType: npc.type, npcTab: 'BUY' });
    }
  }, [sellItems?.length]);
  return (
    <section className="flex h-full gap-1">
      <div className="flex flex-col gap-1.5 border-r px-2">
        <ShopAvatar image={npc.image} name={npc.name} />

        <ul className="flex flex-1 flex-col gap-1">
          {sellItems?.map((i) => {
            const item = itemsTemplateById[i.itemTemplateId];

            return (
              <li
                onClick={() => addShopItem({ id: item.id, name: item.name, image: item.image, quantity: 1, price: i.price })}
                key={item.id}
                className={cn(
                  'hover:border-border relative flex select-none items-center gap-1 rounded border border-transparent px-2 py-1 shadow-2xl hover:cursor-default',
                  {
                    'border-orange-300/10': !!itemsMap[item.id],
                  },
                )}
              >
                <GameItemImg tintColor={TINT_COLOR[item.key as ColoredResourceType]} className="size-10" image={item.image} />
                <div className="flex flex-col gap-0.5 truncate text-sm capitalize">
                  <span className="truncate">{item.name}</span>
                  <div className="flex items-center gap-0.5">
                    <GameIcon className="size-5" image={imageConfig.icon.ui.gold} />
                    <span>{item.buyPrice}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <ShopItemCart mode="BUY" />
    </section>
  );
};
