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