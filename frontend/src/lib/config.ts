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
  IRON: {
    color: 'text-gray-400',
    border: 'border-gray-500/50',
    glow: 'shadow-[0_0_15px_rgba(156,163,175,0.3)] animate-pulse',
    bg: 'bg-gray-700/10',
  },
  COPPER: {
    color: 'text-orange-500',
    border: 'border-orange-600/50',
    glow: 'shadow-[0_0_18px_rgba(249,115,22,0.4)] animate-pulse',
    bg: 'bg-orange-500/10',
  },
  SILVER: {
    color: 'text-slate-300',
    border: 'border-slate-400/50',
    glow: 'shadow-[0_0_20px_rgba(203,213,225,0.4)] animate-[glow_silver_2s_ease-in-out_infinite]',
    bg: 'bg-slate-200/10',
  },
  GOLD: {
    color: 'text-yellow-400',
    border: 'border-yellow-500/50',
    glow: 'shadow-[0_0_25px_rgba(250,204,21,0.5)] animate-[glow_gold_2s_ease-in-out_infinite]',
    bg: 'bg-yellow-400/10',
  },
  MITHRIL: {
    color: 'text-sky-400',
    border: 'border-sky-500/50',
    glow: 'shadow-[0_0_28px_rgba(56,189,248,0.55)] animate-[glow_mithril_2s_ease-in-out_infinite]',
    bg: 'bg-sky-400/10',
  },
  ADAMANTINE: {
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

export const imageConfig = {
  icon: {
    ui: {
      fish: '/sprites/icons/ui/fish.png',
      gold: '/sprites/icons/ui/gold.png',
      prem: '/sprites/icons/ui/prem.png',
      group: '/sprites/icons/ui/group.png',
      logo: '/sprites/icons/ui/logo.png',
      map: '/sprites/icons/ui/map.png',
      random: '/sprites/icons/ui/random.png',
      town: '/sprites/icons/ui/town.png',
      dungeon: '/sprites/icons/ui/dungeon.png',
      leave: '/sprites/icons/ui/leave.png',
      backpack: '/sprites/icons/ui/backpack.png',
      bag: '/sprites/icons/ui/bag.png',
      chest: '/sprites/icons/ui/chest.png',
      battle: '/sprites/icons/ui/battle.png',
      book: '/sprites/icons/ui/book.png',
      defense: '/sprites/icons/ui/defense.png',
      'magic-resistance': '/sprites/icons/ui/defense.png',
      fire: '/sprites/icons/ui/fire.png',
      grave: '/sprites/icons/ui/grave.png',
      hammer: '/sprites/icons/ui/hammer.png',
      pick: '/sprites/icons/ui/pick.png',
      skull: '/sprites/icons/ui/skull.png',
      walk: '/sprites/icons/ui/walk.png',
      refresh: '/sprites/icons/ui/refresh.png',
      settings: '/sprites/icons/ui/settings.png',
    },
    place: {
      mine: '/sprites/icons/places/mine.png',
      solmer: '/sprites/icons/places/solmer.webp',
    },
    building: {
      blacksmith: '/sprites/icons/buildings/blacksmith.png',
      forge: '/sprites/icons/buildings/forge.png',
      'magic-shop': '/sprites/icons/buildings/magic-shop.png',
      temple: '/sprites/icons/buildings/temple.png',
    },
    WEAPON: {
      SWORD: '/sprites/icons/weapon/sword.png',
      AXE: '/sprites/icons/weapon/axe.png',
      DAGGER: '/sprites/icons/weapon/dagger.png',
      STAFF: '/sprites/icons/weapon/staff.png',
    } as Record<WeaponType, string>,
    ARMOR: {
      BOOTS: '/sprites/icons/armor/boots.png',
      BELT: '/sprites/icons/armor/belt.png',
      CHESTPLATE: '/sprites/icons/armor/chest.png',
      GLOVES: '/sprites/icons/armor/gloves.png',
      HELMET: '/sprites/icons/armor/helmet.png',
      SHIELD: '/sprites/icons/armor/shield.png',
    } as Record<ArmorType, string>,
    ACCESSORY: {
      AMULET: '/sprites/icons/accessory/amulet.png',
      RING: '/sprites/icons/accessory/ring.png',
    },
    stat: {
      strength: '/sprites/icons/stats/strength.png',
      constitution: '/sprites/icons/stats/constitution.png',
      intelligence: '/sprites/icons/stats/intelligence.png',
      dexterity: '/sprites/icons/stats/dexterity.png',
      luck: '/sprites/icons/stats/luck.png',
    },
    POTION: {
      buff: {
        strength: '/sprites/icons/potions/str.png',
        constitution: '/sprites/icons/potions/const.png',
        intelligence: '/sprites/icons/potions/ing.png',
        dexterity: '/sprites/icons/potions/dex.png',
        luck: '/sprites/icons/potions/luck.png',
      },
      restore: {
        smallHealth: '/sprites/icons/potions/small-health.png',
        smallMana: '/sprites/icons/potions/small-mana.png',
        smallRestore: '/sprites/icons/potions/small-restore.png',
        mediumHealth: '/sprites/icons/potions/medium-health.png',
        mediumMana: '/sprites/icons/potions/medium-mana.png',
        mediumRestore: '/sprites/icons/potions/medium-restore.png',
      },
    },
    RESOURCES: {
      //ORE
      IRON: '/sprites/icons/resources/ores/iron-ore.png',
      COPPER: '/sprites/icons/resources/ores/copper-ore.png',
      SILVER: '/sprites/icons/resources/ores/silver-ore.png',
      GOLD: '/sprites/icons/resources/ores/gold-ore.png',
      MITHRIL: '/sprites/icons/resources/ores/mithril-ore.png',
      ADAMANTINE: '/sprites/icons/resources/ores/adamantine-ore.png',

      //INGOT
      'IRON-INGOT': '/sprites/icons/resources/ingots/iron-ingot.png',
      'COPPER-INGOT': '/sprites/icons/resources/ingots/copper-ingot.png',
      'SILVER-INGOT': '/sprites/icons/resources/ingots/silver-ingot.png',
      'GOLD-INGOT': '/sprites/icons/resources/ingots/gold-ingot.png',
      'MITHRIL-INGOT': '/sprites/icons/resources/ingots/mithril-ingot.png',
      'ADAMANTINE-INGOT': '/sprites/icons/resources/ingots/adamantine-ingot.png',

      //LEATHER
      'REGULAR-LEATHER': '/sprites/icons/resources/leathers/regular-leather.png',
    } as Record<ResourceType, string>,
  },
  bg: {
    shrine: '/sprites/bg/shrine.png',
    map: {
      SolmereValley: '/sprites/bg/map/solmer-valley.png',
    },
  },
} as const;

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
    slot: 'CHESTPLATE',
    image: imageConfig.icon.ARMOR.CHESTPLATE,
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
