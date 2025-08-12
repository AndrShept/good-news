import type { TileType } from './types';


export interface TileMap {
  compressionlevel: number;
  height: number;
  width: number;
  tileheight: number;
  tilewidth: number;
  infinite: boolean;
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  layers: Layer[];
  tilesets: Tileset[];

  type: string;
  version: string;
}

export interface Layer {
  draworder?: string;
  id: string;
  name: TileType;
  objects: TileObject[];
  data: number[];
  height: number;
  opacity: number;
  type: 'objectgroup' | 'tilelayer';
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface Tileset {
  columns: number;
  firstgid: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
}
export interface TileObject {
  gid: number;
  height: number;
  width: number;
  id: number;
  name: TileType;
  rotation?: number;
  type?: string;
  visible: boolean;
  x: number;
  y: number;
}
