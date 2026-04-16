import { ItemContainer } from '@/features/item-container/components/ItemContainer';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { NPC, NPCSellItem } from '@/shared/types';
import { useNpcStore } from '@/store/useNpcStore';
import { useEffect, useMemo } from 'react';

import { ShopAvatar } from './ShopAvatar';
import { ShopItemCart } from './ShopItemCart';

interface Props {
  buyItems: NPCSellItem[];
  npc: NPC;
}

export const NpcSell = ({ npc, buyItems }: Props) => {
  const { backpack } = useHeroBackpack();
  const { setNpcActiveTab, getEmptyMessage } = useNpcStore();
  const newBackpack = useMemo(() => {
    if (!backpack) return null;
    return {
      ...backpack,
      itemsInstance: backpack.itemsInstance.filter((i) => buyItems.some((b) => b.itemTemplateId === i.itemTemplateId)),
    };
  }, [backpack, buyItems]);
  useEffect(() => {
    if (!newBackpack?.itemsInstance?.length) {
      setNpcActiveTab(null);
      getEmptyMessage({ npcType: npc.type, npcTab: 'SELL' });
    }
  }, [newBackpack?.itemsInstance?.length]);
  if (!newBackpack) return null;
  return (
    <section className="flex h-full gap-1">
      <div className="flex flex-1 flex-col gap-1.5 border-r px-2">
        <ShopAvatar image={npc.image} name={npc.name} />

        <ShopItemCart mode="SELL" />
      </div>
      <div className="flex-1">
        {newBackpack.itemsInstance?.length ? (
          <ItemContainer {...newBackpack} capacity={newBackpack.itemsInstance.length} isShowContainerHeader={false} />
        ) : (
          <p className="text-muted-foreground text-center">nothing to sell</p>
        )}
      </div>
    </section>
  );
};
