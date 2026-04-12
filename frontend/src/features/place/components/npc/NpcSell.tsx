import { ItemContainer } from '@/features/item-container/components/ItemContainer';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { NPC, NPCSellItem } from '@/shared/types';

import { ShopAvatar } from './ShopAvatar';
import { ShopItemCart } from './ShopItemCart';

interface Props {
  buyItems: NPCSellItem[];
  npc: NPC;
}

export const NpcSell = ({ npc, buyItems }: Props) => {
  const { backpack } = useHeroBackpack();

  return (
    <section className="flex h-full gap-1">
      <div className="flex min-w-[170px] flex-col gap-1.5 border-r px-2">
        <ShopAvatar image={npc.image} name={npc.name} />

        <ShopItemCart />
      </div>
      <ItemContainer {...backpack!} isShowContainerHeader={false} />
    </section>
  );
};
