import type { Layer, TileMap } from '@/shared/json-types';
import type { Map, MapNameType, Tile, TileType } from '@/shared/types';
import { and, eq } from 'drizzle-orm';

import { db } from '../db/db';
import { mapTable, tileTable, townTable } from '../db/schema';
import { townEntities } from '../entities/towns';
import { generateRandomUuid } from './utils';

interface MapLoadInfo {
  jsonUrl: TileMap;
  imageUrl: string;
  name: MapNameType;
}

export const getMapJson = (mapId: string) => {
  const map: Record<string, MapLoadInfo> = {
    '01998100-a29d-7b0f-abad-edd4ef317472': {
      name: 'SOLMERE',
      jsonUrl: require('../json/solmer.json'),
      imageUrl: '/sprites/map/solmer.png',
    },
  };
  return map[mapId];
};

interface Params {
  layer: Layer;
  mapId: string;
}

const zIndex: Record<TileType, number> = {
  GROUND: 0,
  OBJECT: 1,
  WATER: 1,
  HERO: 5,
  TOWN: 1,
};

export const getLayerObject = ({ layer, mapId }: Params): Tile[] => {
  const tiles = layer.data
    .map((item, idx): Tile | null => {
      if (item === 0) return null;
      return {
        image: (item - 1).toString(),
        type: layer.name,
        x: idx % layer.width,
        y: Math.floor(idx / layer.height),
        mapId,
        z: zIndex[layer.name],
        id: generateRandomUuid(),
        createdAt: new Date().toISOString(),
        town: undefined,
        townId: null,
      };
    })
    .filter((tile) => !!tile);
  return tiles;
};

export const buildingMapData = async (mapId: string) => {
  const mapJson = getMapJson(mapId);
  const findObjects = mapJson.jsonUrl.layers.find((item) => item.name === 'OBJECT');
  const findWaters = mapJson.jsonUrl.layers.find((item) => item.name === 'WATER');

  console.time('create-map');

  const map = await db.transaction(async (tx) => {
    const [newMap] = await tx
      .insert(mapTable)
      .values({
        id: '01998100-a29d-7b0f-abad-edd4ef317472',
        pvpMode: 'PVE',
        name: mapJson.name,
        image: mapJson.imageUrl,
        height: mapJson.jsonUrl.height,
        width: mapJson.jsonUrl.width,
        tileHeight: mapJson.jsonUrl.tileheight,
        tileWidth: mapJson.jsonUrl.tilewidth,
      })
      .returning();

    const objectsTiles = findObjects && getLayerObject({ layer: findObjects, mapId: newMap.id });
    const waterTiles = findWaters && getLayerObject({ layer: findWaters, mapId: newMap.id });

    const tiles = [...(objectsTiles ?? []), ...(waterTiles ?? [])];

    await tx.insert(tileTable).values(tiles);
    await tx.insert(tileTable).values({
      mapId,
      type: 'TOWN',
      x: 5,
      y: 7,
      z: 1,
      townId: townEntities.SOLMERE.id,
      image: townEntities.SOLMERE.image,
    });

    return newMap;
  });

  console.timeEnd('create-map');
  return map;
};
