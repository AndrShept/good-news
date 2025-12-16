import { useCraftItem } from '@/features/craft/hooks/useCraftItem';
import { ShopBuyButton } from '@/features/shop/components/ShopBuyButton';
import { materialConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
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
export const GameItemCardShowInfo = memo(({ isShowBuyButton = false, isShowPrice = false, ...props }: Props) => {
  const { getMaterialModifier } = useCraftItem();
  const coreMaterialModifier = getMaterialModifier(props, props.coreMaterial);

  return (
    <article className={cn('flex flex-col gap-4 rounded border p-4 text-start')}>
      <section className="flex gap-4">
        <GameItemImg className="size-10" image={props.image} />

        <div className="flex flex-col">
          <h3 className="line-clamp-2 text-base capitalize">{props.name}</h3>
          {props.coreMaterial && (
            <div>
              <span>material: </span>
              <span className={cn(materialConfig[props.coreMaterial]?.color)}>{props.coreMaterial?.split('-')[0]}</span>
            </div>
          )}

          <p className="text-muted-foreground/30 capitalize">{props.type.toLocaleLowerCase()}</p>

          {props.potion && <PotionInfo {...props.potion} />}
          {props.weapon && <WeaponInfo weapon={props.weapon} coreMaterialModifier={coreMaterialModifier} />}
          {props.armor && <ArmorInfo armor={props.armor} coreMaterialModifier={coreMaterialModifier} />}
        </div>
      </section>
      <div className="mt-auto flex justify-between">
        {isShowPrice && (
          <div className="flex items-center gap-0.5">
            <GameIcon image={imageConfig.icon.ui.gold} />
            <span className="text-muted-foreground text-xs">{props.price}</span>
          </div>
        )}
        {isShowBuyButton && (
          <div>
            <ShopBuyButton gameItemId={props.id} />
          </div>
        )}
      </div>
    </article>
  );
});
