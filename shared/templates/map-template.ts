import { imageConfig } from '@/shared/config/image-config';

import solverMine from '../../server/data/json/solmer-mine.json';
import solverValley from '../../server/data/json/solmer-valley.json';
// import test2 from '../../server/data/json/test2.json';
import type { Layer, Tileset } from '../json-types';
import type { GameMap } from '../types';
import { placeTemplate, placeTemplateByName } from './place-template';

export const mapTemplate: GameMap[] = [
  // {
  //   id: '019a350c-5552-76dd-b6d5-181b473d3128',
  //   name: 'Solmere Valley',
  //   offsetX: 0,
  //   offsetY: 0,
  //   height: test2.height ,
  //   width: test2.width  ,
  //   tileHeight: test2.tileheight ,
  //   tileWidth: test2.tilewidth ,
  //   layers: test2.layers as Layer[],
  //   tileset: test2.tilesets as Tileset[],
  //   places: [placeTemplateByName['Solmer Town'], placeTemplateByName['Solmer Mine']],
  //   entrances: [],
  // },
  {
    id: '019a350c-5552-76dd-b6d5-181b473d3128',
    name: 'Solmere Valley',
    height: solverValley.height,
    offsetX: 0,
    offsetY: 0,
    width: solverValley.width,
    tileHeight: solverValley.tileheight,
    tileWidth: solverValley.tilewidth,
    layers: solverValley.layers as Layer[],
    tileset: solverValley.tilesets as Tileset[],
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
    layers: solverMine.layers,
    offsetX: 0,
    offsetY: 0,
    places: [],
    tileset: [],
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
