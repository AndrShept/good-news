import { GameItemImg } from '@/components/GameItemImg';
import { Button } from '@/components/ui/button';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { TINT_COLOR } from '@/lib/config';
import { ColoredResourceType } from '@/shared/types';
import { useShopItemStore } from '@/store/useShopItemStore';

export const BuyItemCart = () => {
  const { items, getTotalPrice, getTotalQuantity, decrement, increment } = useShopItemStore();
  const totalQuantity = getTotalQuantity();
  const { itemsTemplateById } = useGameData();
  if (!totalQuantity) return;
  return (
    <section className="flex flex-1 flex-col">
      <ul className="flex min-h-0 flex-col gap-0.5 md:px-3">
        {items?.map((item) => (
          <li className="flex flex-col items-center justify-between gap-1 md:flex-row" key={item.id}>
            <div className="flex w-full flex-col items-center truncate md:flex-row md:gap-4">
              <div className="flex items-center gap-1 truncate">
                <GameItemImg
                  tintColor={TINT_COLOR[itemsTemplateById[item.id].key as ColoredResourceType]}
                  className="size-8"
                  image={item.image}
                />
                <span className="truncate">{item.name}</span>
              </div>

              <span className="text-muted-foreground md:ml-auto">{item.quantity * item.price}</span>
            </div>
            <div className="flex gap-0.5">
              <Button onClick={() => decrement(item.id)} className="size-6" variant={'ghost'} size={'icon'}>
                -
              </Button>
              <span className="text-yellow-300">{item.quantity}</span>

              <Button onClick={() => increment(item.id)} className="size-5.5" variant={'ghost'} size={'icon'}>
                +
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
