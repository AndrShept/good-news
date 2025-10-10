import { ShopBuyButton } from '@/features/shop/components/ShopBuyButton';
import { cn, rarityConfig } from '@/lib/utils';
import { GameItem } from '@/shared/types';
import { memo } from 'react';

import { ArmorInfo } from './ArmorInfo';
import { PotionInfo } from './PotionInfo';
import { WeaponInfo } from './WeaponInfo';
import { GoldIcon } from './game-icons/GoldIcon';

interface Props extends GameItem {
  isShowPrice?: boolean;
  isShowBuyButton?: boolean;
}
export const GameItemCardShowInfo = memo(
  ({ image, name, type, id, price, rarity, potion, weapon, armor, accessory, isShowBuyButton = false, isShowPrice = false }: Props) => {
    return (
      <article className={cn('flex flex-col gap-4 rounded border p-4 text-start', rarityConfig[rarity].glow, rarityConfig[rarity].border)}>
        <section className="flex gap-4">
          <div>
            <div className="size-10 shrink-0">
              <img style={{ imageRendering: 'pixelated' }} className="size-full" src={image} alt={'item-image'} />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="line-clamp-2 capitalize">{name}</h3>
            <p className={cn(rarityConfig[rarity].color)}>{rarity}</p>
            <p className="text-muted-foreground/30">{type}</p>

            {/* {modifier && <ModifierInfoCard modifier={modifier} />} */}
            {potion && <PotionInfo {...potion} />}
            {weapon && <WeaponInfo {...weapon} rarity={rarity} />}
            {armor && <ArmorInfo {...armor} rarity={rarity} />}
          </div>
        </section>
        <div className="mt-auto flex justify-between">
          {isShowPrice && (
            <div className="flex items-center gap-0.5">
              <GoldIcon />
              <p className="text-muted-foreground text-xs">{price}</p>
            </div>
          )}
          {isShowBuyButton && (
            <div>
              <ShopBuyButton itemId={id ?? ''} />
            </div>
          )}
        </div>
      </article>
    );
  },
);
