import { ShopBuyButton } from '@/features/shop/components/ShopBuyButton';
import { imageConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { GameItem } from '@/shared/types';
import { memo } from 'react';

import { ArmorInfo } from './ArmorInfo';
import { GameIcon } from './GameIcon';
import { GameItemImg } from './GameItemImg';
import { PotionInfo } from './PotionInfo';
import { WeaponInfo } from './WeaponInfo';

interface Props extends GameItem {
  isShowPrice?: boolean;
  isShowBuyButton?: boolean;
}
export const GameItemCardShowInfo = memo(
  ({ image, name, type, id, price, potion, weapon, armor, resource, accessory, isShowBuyButton = false, isShowPrice = false }: Props) => {
    return (
      <article className={cn('flex flex-col gap-4 rounded border p-4 text-start')}>
        <section className="flex gap-4">
          <GameItemImg className="size-10" image={image} />

          <div className="flex flex-col">
            <h3 className="line-clamp-2 capitalize">{name}</h3>
            <p className="text-muted-foreground/30 capitalize">{type.toLocaleLowerCase()}</p>

            {potion && <PotionInfo {...potion} />}
            {weapon && <WeaponInfo {...weapon} />}
            {armor && <ArmorInfo {...armor} />}
          </div>
        </section>
        <div className="mt-auto flex justify-between">
          {isShowPrice && (
            <div className="flex items-center gap-0.5">
              <GameIcon image={imageConfig.icon.ui.gold} />
              <span className="text-muted-foreground text-xs">{price}</span>
            </div>
          )}
          {isShowBuyButton && (
            <div>
              <ShopBuyButton gameItemId={id} />
            </div>
          )}
        </div>
      </article>
    );
  },
);
