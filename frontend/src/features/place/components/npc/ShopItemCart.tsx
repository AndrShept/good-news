import { GameIcon } from '@/components/GameIcon';
import { GameItemImg } from '@/components/GameItemImg';
import { Button } from '@/components/ui/button';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { TINT_COLOR } from '@/lib/config';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { ColoredResourceType } from '@/shared/types';
import { useShopItemStore } from '@/store/useShopItemStore';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';

interface Props {
  mode: 'SELL' | 'BUY';
}
export const ShopItemCart = ({ mode }: Props) => {
  const { items, getTotalQuantity, decrement, increment, removeShopItemByInstanceId } = useShopItemStore();
  const totalQuantity = getTotalQuantity();
  const { itemsTemplateById } = useGameData();

  if (!totalQuantity) return;
  return (
    <ul className="flex flex-1 flex-col gap-0.5">
      <AnimatePresence>
        {items?.map((item) => (
          <m.li
            exit={{ opacity: 1 }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            className={cn('flex items-center justify-between gap-1', {
              'cursor-pointer rounded-md px-2 py-1 hover:bg-rose-500/10': mode === 'SELL',
            })}
            key={item.itemInstanceId ?? item.id}
            onClick={() => {
              if (!item.itemInstanceId) return;
              removeShopItemByInstanceId(item.itemInstanceId);
            }}
          >
            <div className="flex items-center truncate">
              <div className="flex items-center gap-1 truncate">
                <GameItemImg
                  tintColor={TINT_COLOR[itemsTemplateById[item.id].key as ColoredResourceType]}
                  className="size-8"
                  image={item.image}
                />
                <span className="truncate text-sm">{item.name}</span>
              </div>
            </div>
            <div className="flex gap-0.5">
              {mode === 'BUY' && (
                <>
                  {' '}
                  <Button onClick={() => decrement(item.id)} className="size-6" variant={'ghost'} size={'icon'}>
                    -
                  </Button>
                  <span className="text-yellow-300">{item.quantity}</span>
                  <Button onClick={() => increment(item.id)} className="size-5.5" variant={'ghost'} size={'icon'}>
                    +
                  </Button>
                </>
              )}
              {mode === 'SELL' && <span className="ml-1 text-yellow-300 text-sm mr-0.5 leading-6">x{item.quantity}</span>}
              <span className="md:ml-auto">{item.quantity * item.price}</span>
              <GameIcon className="size-6" image={imageConfig.icon.ui.gold} />
            </div>
          </m.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};
