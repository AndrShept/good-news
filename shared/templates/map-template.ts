import { imageConfig } from '@/shared/config/image-config';
import type { TMap } from '@/shared/types';

import solverMine from '../../server/data/json/solmer-mine.json';
import solverValley from '../../server/data/json/solmer-valley.json';
import { placeTemplate, placeTemplateByName } from './place-template';

export const mapTemplate: TMap[] = [
  {
    id: '019a350c-5552-76dd-b6d5-181b473d3128',
    name: 'Solmere Valley',
    height: solverValley.height,
    width: solverValley.width,
    tileHeight: solverValley.tileheight,
    tileWidth: solverValley.tilewidth,
    image: imageConfig.bg.map.SolmereValley,
    layers: solverValley.layers,
    places: [placeTemplateByName['Solmer Town'], placeTemplateByName['Solmer Mine']],
    entrances: [],
  },
  {
    id: 'a7577f33-5bac-4763-bd7f-cbac4c69e06d',
    name: 'Solmere Mine',
    height: solverMine.height,
    width: solverMine.width,
    tileHeight: solverMine.tileheight,
    tileWidth: solverMine.tilewidth,
    image: imageConfig.bg.map.solmerMine,
    layers: solverMine.layers,
    places: [],
    entrances: [
      {
        id: '019c444d-a69c-7512-bd7d-745f3048509e',
        targetPlaceId: placeTemplateByName['Solmer Mine'].id,
        key: 'FROM_MAP_TO_PLACE_SOLMER_MINE',
        x: 2,
        y: 2,
        targetX: placeTemplateByName['Solmer Mine'].x,
        targetY: placeTemplateByName['Solmer Mine'].y,
        image: imageConfig.icon.entrance.portal,
      },
    ],
  },
];
