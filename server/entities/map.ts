import { imageConfig } from '@/shared/config/image-config';
import type { TMap } from '@/shared/types';

import solverValley from '../json/solmer-valley.json';
import { placeEntities } from './places';


export const mapEntities: TMap[] = [
  {
    id: '019a350c-5552-76dd-b6d5-181b473d3128',
    name: 'Solmere Valley',
    height: solverValley.height,
    width: solverValley.width,
    tileHeight: solverValley.tileheight,
    tileWidth: solverValley.tilewidth,
    image: imageConfig.bg.map.SolmereValley,
    layers: solverValley.layers,
    places: placeEntities.filter((p) => p.mapId === '019a350c-5552-76dd-b6d5-181b473d3128'),
  },
];
