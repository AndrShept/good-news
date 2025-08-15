import type { Layer, TileMap } from '@/shared/json-types';
import type { Map, MapNameType, Tile, TileInsert, TileType, WorldObject } from '@/shared/types';
import { and, eq } from 'drizzle-orm';

import { db } from '../db/db';
import { mapTable, tileTable, worldObjectTable } from '../db/schema';
import { worldObjectEntities } from '../entities/world-object';
import { generateRandomUuid } from './utils';

export const getMapJson = (mapName: MapNameType) => {
  const map: Record<MapNameType, TileMap> = {
    SOLMERE: require('../json/solmer.json'),
  };
  return map[mapName];
};

interface Params {
  layer: Layer;
  mapId: string;
}

const zIndex: Record<TileType, number> = {
  GROUND: 0,
  OBJECT: 1,
  DECOR: 5,
};

export const getLayerObject = ({ layer, mapId }: Params): Tile[] => {
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
  const tiles = layer.data
    .map((item, idx): Tile | null => {
      if (item === 0) return null;
      return {
        image: item - 1,
        type: layer.name,
        x: idx % layer.width,
        y: Math.floor(idx / layer.height),
        mapId,
        z: zIndex[layer.name],
        id: generateRandomUuid(),
        createdAt: new Date().toISOString(),
        worldObjectId: null,
        worldObject: undefined,
      };
    })
    .filter((tile) => !!tile);
  return tiles;
};

export const buildingMapData = async (mapName: MapNameType) => {
  const mapJson = getMapJson(mapName);
  const findObjects = mapJson.layers.find((item) => item.name === 'OBJECT');
  const findDecor = mapJson.layers.find((item) => item.name === 'DECOR');
  const findGround = mapJson.layers.find((item) => item.name === 'GROUND');

  console.time('create-map');

  await db.transaction(async (tx) => {
    const [newMap] = await tx
      .insert(mapTable)
      .values({
        pvpMode: 'PVE',
        name: mapName,
        height: mapJson.height * mapJson.tileheight,
        width: mapJson.width * mapJson.tilewidth,
        tileHeight: mapJson.tileheight,
        tileWidth: mapJson.tilewidth,
      })
      .returning();

    const objectsTiles = findObjects && getLayerObject({ layer: findObjects, mapId: newMap.id });
    const decorTiles = findDecor && getLayerObject({ layer: findDecor, mapId: newMap.id });
    const grounTiles = findGround && getLayerObject({ layer: findGround, mapId: newMap.id });
    const tiles = [...(grounTiles ?? []), ...(objectsTiles ?? []), ...(decorTiles ?? [])];
    await tx.insert(tileTable).values(tiles).returning();
    const [solmerTown] = await tx
      .insert(worldObjectTable)
      .values({
        ...worldObjectEntities.SOLMERE,
      })
      .returning();
    await tx
      .update(tileTable)
      .set({
        worldObjectId: solmerTown.id,
      })
      .where(and(eq(tileTable.x, 3), eq(tileTable.y, 3)));
    return newMap;
  });

  const map = await db.query.mapTable.findFirst({
    where: eq(mapTable.name, mapName),
    with: {
      tiles: {
        with: {
          worldObject: true,
        },
      },
    },
  });
  console.timeEnd('create-map');
  return map;
};
