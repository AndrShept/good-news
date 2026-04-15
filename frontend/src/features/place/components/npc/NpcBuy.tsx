import { useGameData } from '@/features/hero/hooks/useGameData';
import { NPC, NPCSellItem } from '@/shared/types';
import { useNpcStore } from '@/store/useNpcStore';
import { useShopItemStore } from '@/store/useShopItemStore';
import { useEffect, useMemo } from 'react';

import { NpcBuyItemCard } from './NpcBuyItemCard';
import { ShopAvatar } from './ShopAvatar';
import { ShopItemCart } from './ShopItemCart';

interface Props {
  sellItems: NPCSellItem[];
  npc: NPC;
}

export const NpcBuy = ({ sellItems, npc }: Props) => {
  const items = useShopItemStore((state) => state.items);
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
            const template = itemsTemplateById[i.itemTemplateId];

            return (
              <NpcBuyItemCard
                key={template.id}
                templateKey={template.key}
                id={template.id}
                image={template.image}
                name={template.name}
                price={i.price}
                isSelect={!!itemsMap[template.id]}
              />
            );
          })}
        </ul>
      </div>

      <ShopItemCart mode="BUY" />
    </section>
  );
};
