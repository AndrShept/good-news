import { imageConfig } from '@/shared/config/image-config';
import type { TPlace } from '@/shared/types';

import { buildingTemplate } from './building-template';

export const placeTemplate = [
  {
    id: '0198c15a-149a-7cb5-bbf2-bf8ddd2c9f98',
    name: 'Solmer Town',
    image: imageConfig.icon.place.solmer,
    x: 7,
    y: 7,
    buildings: [
      buildingTemplate['MAGIC-SHOP'],
      buildingTemplate.TEMPLE,
      buildingTemplate.BLACKSMITH,
      buildingTemplate.FORGE,
      buildingTemplate.BANK,
    ],
    mapId: '019a350c-5552-76dd-b6d5-181b473d3128',
    entrances: [],
  },
  {
    id: '0199df1f-88e5-747c-b54b-afe86110b246',
    name: 'Solmer Mine',
    image: imageConfig.icon.place.mine,
    x: 10,
    y: 10,
    mapId: '019a350c-5552-76dd-b6d5-181b473d3128',
    buildings: [buildingTemplate.FORGE],
    entrances: [
      {
        id: '019c444d-e6e3-75ee-a4ba-81affd7689ab',
        key: 'FROM_SOLMER_MINE_TO_MAP',
        minLevel: 1,
        x: 10,
        y: 10,
        targetMapId: 'a7577f33-5bac-4763-bd7f-cbac4c69e06d',
        targetX: 2,
        targetY: 2,
        image: imageConfig.icon.entrance.mine,
      },
    ],
  },
] as const satisfies TPlace[];

const placeName = placeTemplate.map((p) => p.name);
type PlaceNameType = (typeof placeName)[number];
export const placeTemplateByName = placeTemplate.reduce(
  (acc, place) => {
    acc[place.name] = place;
    return acc;
  },
  {} as Record<PlaceNameType, TPlace>,
);
