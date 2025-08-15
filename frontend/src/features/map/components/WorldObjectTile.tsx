import { WorldObject } from '@/shared/types';
import React from 'react';

import { useChangeMap } from '../hooks/useChangeMap';

interface Props extends WorldObject {
  tileId: string;
}

export const WorldObjectTile = (props: Props) => {
  const { image, tileId, } = props;
  const { changeTile } = useChangeMap('SOLMERE');
  return (
    <>
      <img
        // onClick={() =>
        //   changeTile({
        //     tileId,
        //     params: {
        //       worldObject: undefined,
        //       worldObjectId: undefined,
        //     },
        //   })
        // }
        draggable={false}
        className="absolute left-0 top-0 size-full hover:border"
        style={{ imageRendering: 'pixelated' }}
        src={image}
      />
    </>
  );
};
