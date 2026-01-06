import { imageConfig } from '@/shared/config/image-config';
import type {  TPlace } from '@/shared/types';
import { buildingTemplate } from './building-template';


export const placeTemplate: TPlace[] = [
  {
    id: '0198c15a-149a-7cb5-bbf2-bf8ddd2c9f98',
    name: 'Solmer Town',
    type: 'TOWN',
    image: imageConfig.icon.place.solmer,
    x: 7,
    y: 7,
    buildings: [buildingTemplate['MAGIC-SHOP'], buildingTemplate.TEMPLE, buildingTemplate.BLACKSMITH, buildingTemplate.FORGE, buildingTemplate.BANK],
    mapId: '019a350c-5552-76dd-b6d5-181b473d3128',
  },
  {
    id: '0199df1f-88e5-747c-b54b-afe86110b246',
    name: 'Solmer Mine',
    type: 'MINE',
    image: imageConfig.icon.place.mine,
    x: 10,
    y: 10,
    mapId: '019a350c-5552-76dd-b6d5-181b473d3128',
    buildings: [buildingTemplate.FORGE],
  },
];
