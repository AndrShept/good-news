import { TintColor } from '@/components/GameItemImg';
import { imageConfig } from '@/shared/config/image-config';
import {
  ArmorType,
  CoreResourceType,
  EquipmentSlotType,

  ResourceType,
  WeaponType,

} from '@/shared/types';

export const parentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.3, staggerDirection: -1 } },
};
export const childrenVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 2 },
};

export const rarityConfig = {
  COMMON: {
    color: '',
    border: '',
    glow: '',
    bg: '',
  },
  MAGIC: {
    color: 'text-rarity-magic',
    border: 'border-rarity-magic/50 ',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.4)]',
    bg: 'bg-rarity-magic/10',
  },
  RARE: {
    color: 'text-rarity-rare',
    border: 'border-rarity-rare/50',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    bg: 'bg-rarity-rare/10',
  },
  EPIC: {
    color: 'text-rarity-epic',
    border: 'border-rarity-epic/50',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    bg: 'bg-rarity-epic/10',
  },
  LEGENDARY: {
    color: 'text-rarity-legendary',
    border: 'border-rarity-legendary/60 border-1',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]',
    bg: 'bg-rarity-legendary/10',
  },
};

interface MaterialProps {
  color: string;
  border: string;
  glow: string;
  bg: string;
}

export const materialConfig: Partial<Record<CoreResourceType, MaterialProps>> = {
  IRON_INGOT: {
    color: 'text-gray-400',
    border: 'border-gray-500/50',
    glow: 'shadow-[0_0_15px_rgba(156,163,175,0.3)] animate-pulse',
    bg: 'bg-gray-700/10',
  },
  COPPER_INGOT: {
    color: 'text-orange-500',
    border: 'border-orange-600/50',
    glow: 'shadow-[0_0_18px_rgba(249,115,22,0.4)] animate-pulse',
    bg: 'bg-orange-500/10',
  },
  SILVER_INGOT: {
    color: 'text-slate-300',
    border: 'border-slate-400/50',
    glow: 'shadow-[0_0_20px_rgba(203,213,225,0.4)] animate-[glow_silver_2s_ease-in-out_infinite]',
    bg: 'bg-slate-200/10',
  },
  GOLD_INGOT: {
    color: 'text-yellow-400',
    border: 'border-yellow-500/50',
    glow: 'shadow-[0_0_25px_rgba(250,204,21,0.5)] animate-[glow_gold_2s_ease-in-out_infinite]',
    bg: 'bg-yellow-400/10',
  },
  MITHRIL_INGOT: {
    color: 'text-sky-400',
    border: 'border-sky-500/50',
    glow: 'shadow-[0_0_28px_rgba(56,189,248,0.55)] animate-[glow_mithril_2s_ease-in-out_infinite]',
    bg: 'bg-sky-400/10',
  },
  ADAMANTINE_INGOT: {
    color: 'text-emerald-400',
    border: 'border-emerald-500/50',
    glow: 'shadow-[0_0_30px_rgba(52,211,153,0.6)] animate-[glow_adamantine_2s_ease-in-out_infinite]',
    bg: 'bg-emerald-400/10',
  },
  REGULAR_LEATHER: {
    color: 'text-gray-400',
    border: 'border-gray-500/50',
    glow: 'shadow-[0_0_15px_rgba(156,163,175,0.3)] animate-pulse',
    bg: 'bg-gray-700/10',
  },
};

interface EquipmentImage {
  id: number;
  image: string;
  slot: EquipmentSlotType;
}
export const BASE_EQUIPMENTS_IMAGE: EquipmentImage[] = [
  {
    id: 1,
    slot: 'HELMET',
    image: imageConfig.icon.ARMOR.HELMET,
  },
  {
    id: 2,
    slot: 'CHEST',
    image: imageConfig.icon.ARMOR.CHEST,
  },

  {
    id: 4,
    slot: 'GLOVES',
    image: imageConfig.icon.ARMOR.GLOVES,
  },
  {
    id: 3,
    slot: 'BELT',
    image: '/sprites/icons/belt.png',
  },
  {
    id: 5,
    slot: 'BOOTS',
    image: imageConfig.icon.ARMOR.BOOTS,
  },

  {
    id: 8,
    slot: 'AMULET',
    image: imageConfig.icon.ACCESSORY.AMULET,
  },
  {
    id: 9,
    slot: 'RING_LEFT',
    image: imageConfig.icon.ACCESSORY.RING,
  },
  {
    id: 10,
    slot: 'RING_RIGHT',
    image: imageConfig.icon.ACCESSORY.RING,
  },
  {
    id: 6,
    slot: 'RIGHT_HAND',
    image: imageConfig.icon.WEAPON.SWORD,
  },
  {
    id: 7,
    slot: 'LEFT_HAND',
    image: imageConfig.icon.ARMOR.SHIELD,
  },
];

export const TINT_COLOR = {
  IRON_INGOT: { color: [180, 180, 190], brightness: 1.0, saturate: 0.8, contrast: 1 },
  COPPER_INGOT: { color: [200, 100, 50], brightness: 1.1, saturate: 1.3, contrast: 1 },
  SILVER_INGOT: { color: [200, 210, 220], brightness: 2, saturate: 1, contrast: 0.8 },
  GOLD_INGOT: { color: [220, 180, 40], brightness: 1.2, saturate: 1.4, contrast: 1.1 },
  MITHRIL_INGOT: { color: [80, 140, 220], brightness: 1.2, saturate: 1.4, contrast: 1.2 },
  ADAMANTINE_INGOT: { color: [60, 200, 140], brightness: 1.3, saturate: 1.5, contrast: 1.2 },

  IRON_ORE: { color: [180, 180, 190], brightness: 1.0, saturate: 0.8, contrast: 1 },
  COPPER_ORE: { color: [200, 100, 50], brightness: 1.1, saturate: 1.3, contrast: 1 },
  SILVER_ORE: { color: [200, 210, 220], brightness: 2, saturate: 1, contrast: 0.8 },
  GOLD_ORE: { color: [220, 180, 40], brightness: 1.2, saturate: 1.4, contrast: 1.1 },
  MITHRIL_ORE: { color: [80, 140, 220], brightness: 1.2, saturate: 1.4, contrast: 1.2 },
  ADAMANTINE_ORE: { color: [60, 200, 140], brightness: 1.3, saturate: 1.5, contrast: 1.2 },

  REGULAR_FUR: null,
  THICK_FUR: { color: [130, 100, 60], brightness: 0.9, saturate: 1.1, contrast: 1.1 },
  DARK_FUR: { color: [80, 65, 50], brightness: 0.8, saturate: 1.2, contrast: 1.2 },
  SHADOW_FUR: { color: [40, 35, 55], brightness: 0.7, saturate: 1.3, contrast: 1.4 },
  SNOW_FUR: { color: [230, 235, 240], brightness: 1.3, saturate: 0.4, contrast: 1.2 },

  REGULAR_CURED_FUR: null,
  THICK_CURED_FUR: { color: [130, 100, 60], brightness: 0.9, saturate: 1.1, contrast: 1.1 },
  DARK_CURED_FUR: { color: [80, 65, 50], brightness: 0.8, saturate: 1.2, contrast: 1.2 },
  SHADOW_CURED_FUR: { color: [40, 35, 55], brightness: 0.7, saturate: 1.3, contrast: 1.4 },
  SNOW_CURED_FUR: { color: [230, 235, 240], brightness: 1.3, saturate: 0.4, contrast: 1.2 },

  REGULAR_HIDE: null,
  ROUGH_HIDE: { color: [120, 75, 40], brightness: 0.9, saturate: 1.1, contrast: 1.1 },
  REPTILE_HIDE: { color: [60, 140, 70], brightness: 0.95, saturate: 1.4, contrast: 1.2 },
  IRON_HIDE: { color: [180, 180, 190], brightness: 1.0, saturate: 0.8, contrast: 1.2 },
  DEMON_HIDE: { color: [150, 30, 20], brightness: 0.8, saturate: 1.5, contrast: 1.4 },
  DRAGON_HIDE: { color: [160, 20, 20], brightness: 0.9, saturate: 1.6, contrast: 1.5 },

  REGULAR_LEATHER: null,
  ROUGH_LEATHER: { color: [120, 75, 40], brightness: 0.9, saturate: 1.1, contrast: 1.1 },
  REPTILE_LEATHER: { color: [60, 140, 70], brightness: 0.95, saturate: 1.4, contrast: 1.2 },
  IRON_LEATHER: { color: [180, 180, 190], brightness: 1.0, saturate: 0.8, contrast: 1.2 },
  DEMON_LEATHER: { color: [150, 30, 20], brightness: 0.8, saturate: 1.5, contrast: 1.4 },
  DRAGON_LEATHER: { color: [160, 20, 20], brightness: 0.9, saturate: 1.6, contrast: 1.5 },

  REGULAR_LOG: null,
  PINE_LOG: { color: [210, 180, 120], brightness: 1.1, saturate: 0.9, contrast: 1.1 },
  OAK_LOG: { color: [160, 110, 60], brightness: 1.0, saturate: 1.0, contrast: 1.1 },
  ASH_LOG: { color: [200, 195, 180], brightness: 1.1, saturate: 0.7, contrast: 1.0 },
  YEW_LOG: { color: [140, 70, 50], brightness: 1.0, saturate: 1.2, contrast: 1.2 },
  MAHOGANY_LOG: { color: [160, 50, 30], brightness: 0.9, saturate: 1.3, contrast: 1.3 },
  EBONY_LOG: { color: [50, 30, 70], brightness: 0.8, saturate: 1.4, contrast: 1.4 },
  BLOOD_LOG: { color: [180, 20, 20], brightness: 0.9, saturate: 1.5, contrast: 1.4 },
  GHOST_LOG: { color: [160, 190, 220], brightness: 1.2, saturate: 0.6, contrast: 1.1 },

  REGULAR_PLANK: null,
  PINE_PLANK: { color: [210, 180, 120], brightness: 1.1, saturate: 0.9, contrast: 1.1 },
  OAK_PLANK: { color: [160, 110, 60], brightness: 1.0, saturate: 1.0, contrast: 1.1 },
  ASH_PLANK: { color: [200, 195, 180], brightness: 1.1, saturate: 0.7, contrast: 1.0 },
  YEW_PLANK: { color: [140, 70, 50], brightness: 1.0, saturate: 1.2, contrast: 1.2 },
  MAHOGANY_PLANK: { color: [160, 50, 30], brightness: 0.9, saturate: 1.3, contrast: 1.3 },
  EBONY_PLANK: { color: [50, 30, 70], brightness: 0.8, saturate: 1.4, contrast: 1.4 },
  BLOOD_PLANK: { color: [180, 20, 20], brightness: 0.9, saturate: 1.5, contrast: 1.4 },
  GHOST_PLANK: { color: [160, 190, 220], brightness: 1.2, saturate: 0.6, contrast: 1.1 },

  REGULAR_BONE: null,
  REGULAR_CLOTH: null,

} as const satisfies Record<Exclude<ResourceType, 'FIBER'>, TintColor | null>;
