import type { Layer, TileMap } from '@/shared/json-types';
import type { MapNameType, Tile, TileType, WorldObject } from '@/shared/types';
import { and, eq } from 'drizzle-orm';

import { db } from '../db/db';
import { mapTable, tileTable, worldObjectTable } from '../db/schema';
import { worldObjectEntities } from '../entities/world-object';
import { generateRandomUuid } from './utils';

export const getMap = (mapName: MapNameType) => {
  const map: Record<MapNameType, TileMap> = {
    SOLMERE: require('../json/solmer.json'),
  };
  return map[mapName];
};

export const getLayerObject = (layer: Layer, tileWidth: number, tileHeight: number) => {
  // if (layer?.name === 'TOWN') {
  //   return layer.objects.map((object) => ({
  //     ...object,
  //     id: generateRandomUuid(),
  //     type: layer.name,
  //     image: object.gid - 1,
  //     x: object.x / object.width,
  //     y: object.y / object.height - 1,
  //   }));
  // }

  return layer.data
    .map((item, idx) => {
      if (item === 0) return null;
      return {
        id: generateRandomUuid(),
        image: item - 1,
        height: tileHeight,
        width: tileWidth,
        type: layer.name,
        x: idx % layer.width,
        y: Math.floor(idx / layer.height),
      };
    })
    .filter(Boolean);
};

export const buildingMapData = async (mapName: MapNameType) => {
  const map = getMap(mapName);
  const findObjects = map.layers.find((item) => item.name === 'OBJECT');
  const findDecor = map.layers.find((item) => item.name === 'DECOR');
  const findGround = map.layers.find((item) => item.name === 'GROUND');

  const zIndex: Record<TileType, number> = {
    GROUND: 0,
    OBJECT: 1,
    DECOR: 5,
  };

  const dataObjects = findObjects && getLayerObject(findObjects, map.tilewidth, map.tileheight);
  const dataDecors = findDecor && getLayerObject(findDecor, map.tilewidth, map.tileheight);
  const dataGround = findGround && getLayerObject(findGround, map.tilewidth, map.tileheight);
  console.time('create-map');
  const mapTiles = [...(dataGround ?? []), ...(dataDecors ?? []), ...(dataObjects ?? [])];
  if (!mapTiles) {
    console.error('map Tiles not found');
    return;
  }

  const returningMap = await db.transaction(async (tx) => {
    const [newMap] = await tx
      .insert(mapTable)
      .values({
        pvpMode: 'PVE',
        name: mapName,
        height: map.height * map.tileheight,
        width: map.width * map.tilewidth,
        tileHeight: map.tileheight,
        tileWidth: map.tilewidth,
      })
      .returning();

    const [solmerTown] = await tx
      .insert(worldObjectTable)
      .values({
        ...worldObjectEntities.SOLMERE,
      })
      .returning();
    const tiles: Tile[] = mapTiles.map((t) => {
      if (t?.x === 3 && t?.y === 3) {
        return {
          id: generateRandomUuid(),
          createdAt: new Date().toISOString(),
          type: 'OBJECT' as TileType,
          x: t?.x ?? 0,
          y: t?.y ?? 0,
          z: 1,
          mapId: newMap.id,
          image: t?.image ?? 0,
          worldObjectId: solmerTown.id,
          worldObject: solmerTown,
        };
      }
      return {
        id: generateRandomUuid(),
        createdAt: new Date().toISOString(),
        type: t?.type ?? 'GROUND',
        x: t?.x ?? 0,
        y: t?.y ?? 0,
        z: zIndex[t?.type ?? 'GROUND'],
        mapId: newMap.id,
        image: t?.image ?? 0,
        worldObjectId: null,
        worldObject: undefined,
      };
    });
    if (!tiles) return;
      await  tx.insert(tileTable).values(tiles);

    return {
      ...newMap,
      tiles
    };
  });

  console.timeEnd('create-map');
  return returningMap;
};
