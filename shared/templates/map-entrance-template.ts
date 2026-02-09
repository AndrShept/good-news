import { imageConfig } from '@/shared/config/image-config';
import type { MapEntrance } from '@/shared/types';

import { placeTemplateByName } from './place-template';

export const mapEntranceTemplate = [
  {
    id: '019c444d-a69c-7512-bd7d-745f3048509e',
    placeId: placeTemplateByName['Solmer Mine'].id,
    key: 'FROM_MAP_TO_PLACE_SOLMER_MINE',
    x: 2,
    y: 2,
    image: imageConfig.icon.entrance.portal,
  },
] as const satisfies MapEntrance[];

const mapEntranceKey = mapEntranceTemplate.map((e) => e.key);
type EntranceKeyType = (typeof mapEntranceKey)[number];
export const mapEntranceTemplateByKey = mapEntranceTemplate.reduce(
  (acc, entrance) => {
    acc[entrance.key] = entrance;
    return acc;
  },
  {} as Record<EntranceKeyType, MapEntrance>,
);
