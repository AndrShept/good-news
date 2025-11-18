import { ResourceType } from '@/shared/types';

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

export const materialConfig: Record<ResourceType, MaterialProps> = {
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
};

export const iconConfig = {
  ui: {
    fish: '/sprites/icons/fish.png',
    gold: '/sprites/icons/gold.png',
    prem: '/sprites/icons/prem.png',
    group: '/sprites/icons/group.png',
    logo: '/sprites/icons/group.logo',
    map: '/sprites/icons/group.map',
    random: '/sprites/icons/random.png',
    town: '/sprites/icons/town.png',
  },
  weapon: {
sword: ''
  },
  stat: {
    strength: '/sprites/icons/stats/strength.png',
    constitution: '/sprites/icons/stats/constitution.png',
    intelligence: '/sprites/icons/stats/intelligence.png',
    dexterity: '/sprites/icons/stats/dexterity.png',
    luck: '/sprites/icons/stats/luck.png',
  },
  potion: {
    buff: {
      strength: '/sprites/potions/str.png',
      constitution: '/sprites/potions/const.png',
      intelligence: '/sprites/potions/ing.png',
      dexterity: '/sprites/potions/dex.png',
      luck: '/sprites/potions/luck.png',
    },
    restore: {
      smallHealth: '/sprites/potions/small-health.png',
      smallMana: '/sprites/potions/small-mana.png',
      smallRestore: '/sprites/potions/small-restore.png',
      mediumHealth: '/sprites/potions/medium-health.png',
      mediumMana: '/sprites/potions/medium-mana.png',
      mediumRestore: '/sprites/potions/medium-restore.png',
    },
  },
  resource: {
    ore: {
      iron: '/sprites/ores/iron-ore.png',
      copper: '/sprites/ores/copper-ore.png',
      silver: '/sprites/ores/silver-ore.png',
      gold: '/sprites/ores/gold-ore.png',
      mithril: '/sprites/ores/mithril-ore.png',
      adamantine: '/sprites/ores/adamantine-ore.png',
    },
    wood: {},
    leather: {},
    herb: {},
  },
};
