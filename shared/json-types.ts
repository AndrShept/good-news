export interface IMapJson {
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
  data?: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  objects?: TiledObject[];
  width: number;
  x: number;
  y: number;
}

export interface ObjectProperty {
  name: string;
  type: string;
  value: string;
}

export interface TiledObject {
  gid: number;
  height: number;
  id: number;
  name: string;
  properties: ObjectProperty[];
  rotation: number;
  type: string;
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
