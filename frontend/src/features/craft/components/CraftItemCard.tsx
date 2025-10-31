import { ArmorInfo } from '@/components/ArmorInfo';
import { GameItemImg } from '@/components/GameItemImg';
import { WeaponInfo } from '@/components/WeaponInfo';
import { CraftItem } from '@/shared/types';
import React, { memo } from 'react';

type Props = CraftItem;
export const CraftItemCard = memo((props: Props) => {
  return (
    <div className="mx-auto flex flex-col items-center gap-1 text-center">
      <h3 className="text-lg font-semibold md:text-xl capitalize">{props?.gameItem?.name}</h3>
      <GameItemImg className="md:size-15 size-10" image={props?.gameItem?.image} />
      <p className="text-muted-foreground/30 capitalize">{props?.gameItem?.type.toLocaleLowerCase()}</p>
      {props?.gameItem?.weapon && <WeaponInfo {...props.gameItem.weapon} />}
      {props?.gameItem?.armor && <ArmorInfo {...props.gameItem.armor} />}
    </div>
  );
});
