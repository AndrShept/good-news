import { CounterBadge } from '@/components/CounterBadge';
import { GameIcon } from '@/components/GameIcon';
import { GameItemImg } from '@/components/GameItemImg';
import { getShopItemsOptions } from '@/features/shop/api/get-shop-items';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { BuildingType } from '@/shared/types';
import { useShopItemStore } from '@/store/useShopItemStore';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface Props {
  buildingType: BuildingType;
}

export const ShopItems = ({ buildingType }: Props) => {
  const { data: shopItems, isLoading } = useQuery(getShopItemsOptions(buildingType));
  const addShopItem = useShopItemStore((state) => state.addShopItem);
  const items = useShopItemStore((state) => state.items);

  const itemsMap = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [items]);

  if (isLoading) return <p>Shop Loading...</p>;
  return (
    <section className="flex flex-col items-center gap-2">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {shopItems?.map((item) => (
          <li
            onClick={() => addShopItem({ id: item.id, name: item.name, image: item.image, quantity: 1, price: item.buyPrice ?? 0 })}
            key={item.id}
            className={cn("bg-secondary/40 hover:border-border relative flex items-center gap-1 rounded border border-transparent px-3 py-2 shadow-2xl hover:cursor-default select-none", {
              'bg-orange-300/10': !!itemsMap[item.id]
            })}
          >
            <GameItemImg className="size-10" image={item.image} />
            <div className="flex flex-col gap-0.5 truncate text-sm capitalize">
              <span className="truncate">{item.name}</span>
              <div className="flex items-center gap-0.5">
                <GameIcon className="size-5" image={imageConfig.icon.ui.gold} />
                <span>{item.buyPrice}</span>
              </div>
            </div>
            {!!itemsMap[item.id] && <CounterBadge className="text-primary -left-3" value={itemsMap[item.id]} />}
          </li>
        ))}
      </ul>
    </section>
  );
};
