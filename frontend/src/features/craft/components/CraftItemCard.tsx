import { CraftItem } from '@/shared/types';
import React, { memo } from 'react';

type Props = CraftItem;
export const CraftItemCard = memo((props: Props) => {
  return (
    <>
      <img src={props?.gameItem?.image} />
    </>
  );
});
