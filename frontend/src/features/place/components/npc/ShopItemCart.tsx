import { GameItemImg } from '@/components/GameItemImg';
import { Button } from '@/components/ui/button';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { TINT_COLOR } from '@/lib/config';
import { ColoredResourceType } from '@/shared/types';
import { useShopItemStore } from '@/store/useShopItemStore';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';

export const ShopItemCart = () => {
  const { items, getTotalQuantity, decrement, increment } = useShopItemStore();
  const totalQuantity = getTotalQuantity();
  const { itemsTemplateById } = useGameData();

  if (!totalQuantity) return;
  return (
    <ul className="flex flex-1 flex-col gap-0.5">
      <AnimatePresence>
        {items?.map((item) => (
          <m.li
            exit={{ opacity: 1 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            className="flex items-center justify-between gap-1"
            key={item.id}
          >
            <div className="flex items-center truncate">
              <div className="flex items-center gap-1 truncate">
                <GameItemImg
                  tintColor={TINT_COLOR[itemsTemplateById[item.id].key as ColoredResourceType]}
                  className="size-8"
                  image={item.image}
                />
                <span className="truncate">{item.name}</span>
              </div>
            </div>
            <div className="flex gap-0.5">
              <span className="text-muted-foreground md:ml-auto">{item.quantity * item.price}</span>

              <Button onClick={() => decrement(item.id)} className="size-6" variant={'ghost'} size={'icon'}>
                -
              </Button>
              <span className="text-yellow-300">{item.quantity}</span>

              <Button onClick={() => increment(item.id)} className="size-5.5" variant={'ghost'} size={'icon'}>
                +
              </Button>
            </div>
          </m.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};
