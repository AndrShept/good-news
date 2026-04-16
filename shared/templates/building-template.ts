import { imageConfig } from '@/shared/config/image-config';
import type { Building, BuildingKey } from '@/shared/types';

export const buildingTemplate = [

  {
    id: '0198c1b2-a9ac-7005-bd8b-ab6014b86374',
    name: 'Temple',
    key: 'TEMPLE',
    image: imageConfig.icon.building.temple,
  },
  {
    id: '019b3361-12c8-7a81-b6e4-731ffb190e16',
    name: 'Bank',
    key: 'BANK',
    image: imageConfig.icon.ui.chest3,
  },
  {
    id: '019aa81a-8a32-73df-800a-fcc28ef44821',
    name: 'Blacksmith',
    key: 'BLACKSMITH',
    image: imageConfig.icon.building.blacksmith,
  },

  {
    id: '019c0fb8-4bde-7911-8092-75bc5710aa71',
    name: 'Alchemy',
    key: 'ALCHEMY',
    image: imageConfig.icon.building.alchemy,
  },
  {
    id: '019c0fb8-b7c4-7598-a3b5-17aed6846eba',
    name: 'Tailor',
    key: 'TAILOR',
    image: imageConfig.icon.building.tailor,
  },
  {
    id: '019d30dd-2045-794c-8a95-bf82a5a028b3',
    name: 'Carpenter',
    key: 'CARPENTER',
    image: imageConfig.icon.building.carpenter,
  },
  {
    id: '019d30dd-54e4-79d4-9d7a-0e2d67b07dbf',
    name: 'Loom',
    key: 'LOOM',
    image: imageConfig.icon.building.loom,
  },
  {
    id: '019d30dd-c0fe-7aec-8a6a-67291236f115',
    name: 'Sawmill',
    key: 'SAWMILL',
    image: imageConfig.icon.building.sawmill,
  },
  {
    id: '019d30de-44d4-7370-8ca0-8d0e2090beca',
    name: 'Tannery',
    key: 'TANNERY',
    image: imageConfig.icon.building.tannery,
  },

  {
    id: '019aa81b-95fa-773d-a54a-f1b57745444a',
    name: 'Forge',
    key: 'FORGE',
    image: imageConfig.icon.building.forge,
  },
] as const satisfies Building[];

export const buildingTemplateById = buildingTemplate.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, Building>,
);
export const buildingTemplateByKey = buildingTemplate.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<BuildingKey, Building>,
);
