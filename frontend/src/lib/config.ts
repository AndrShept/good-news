import { imageConfig } from '@/shared/image-config';
import { ArmorType, EquipmentSlotType, ResourceCategoryType, ResourceType, WeaponType } from '@/shared/types';

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

export const materialConfig: Partial<Record<ResourceType, MaterialProps>> = {
  'IRON-INGOT': {
    color: 'text-gray-400',
    border: 'border-gray-500/50',
    glow: 'shadow-[0_0_15px_rgba(156,163,175,0.3)] animate-pulse',
    bg: 'bg-gray-700/10',
  },
  'COPPER-INGOT': {
    color: 'text-orange-500',
    border: 'border-orange-600/50',
    glow: 'shadow-[0_0_18px_rgba(249,115,22,0.4)] animate-pulse',
    bg: 'bg-orange-500/10',
  },
  'SILVER-INGOT': {
    color: 'text-slate-300',
    border: 'border-slate-400/50',
    glow: 'shadow-[0_0_20px_rgba(203,213,225,0.4)] animate-[glow_silver_2s_ease-in-out_infinite]',
    bg: 'bg-slate-200/10',
  },
  'GOLD-INGOT': {
    color: 'text-yellow-400',
    border: 'border-yellow-500/50',
    glow: 'shadow-[0_0_25px_rgba(250,204,21,0.5)] animate-[glow_gold_2s_ease-in-out_infinite]',
    bg: 'bg-yellow-400/10',
  },
  'MITHRIL-INGOT': {
    color: 'text-sky-400',
    border: 'border-sky-500/50',
    glow: 'shadow-[0_0_28px_rgba(56,189,248,0.55)] animate-[glow_mithril_2s_ease-in-out_infinite]',
    bg: 'bg-sky-400/10',
  },
  'ADAMANTINE-INGOT': {
    color: 'text-emerald-400',
    border: 'border-emerald-500/50',
    glow: 'shadow-[0_0_30px_rgba(52,211,153,0.6)] animate-[glow_adamantine_2s_ease-in-out_infinite]',
    bg: 'bg-emerald-400/10',
  },
  'REGULAR-LEATHER': {
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
