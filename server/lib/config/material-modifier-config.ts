import type { ArmorType, ClothType, IngotType, LeatherType, OmitModifier, PlankType, ResourceType, WeaponType } from '@/shared/types';

export interface IMaterialModifierConfig {
  WEAPON: Record<IngotType, Partial<OmitModifier>>;
  SHIELD: Record<IngotType | PlankType, Partial<OmitModifier>>;
  ARMOR: {
    PLATE: Record<IngotType, Partial<OmitModifier>>;
    MAIL: Record<IngotType, Partial<OmitModifier>>;
    LEATHER: Record<LeatherType, Partial<OmitModifier>>;
    CLOTH: Record<ClothType, Partial<OmitModifier>>;
  };
  STAFF: Record<PlankType, Partial<OmitModifier>>;
}

export const materialModifierConfig: IMaterialModifierConfig = {
  WEAPON: {
    IRON_INGOT: {
      physDamage: 5,
    },

    COPPER_INGOT: {
      physDamage: 12,
      physPenetration: 10,
    },

    SILVER_INGOT: {
      physHitRating: 60,
      physPenetration: 15,
    },

    GOLD_INGOT: {
      physCritRating: 50,
      physCritDamage: 60,
    },

    MITHRIL_INGOT: {
      physDamage: 20,
      physHitRating: 40,
      physCritRating: 30,
    },

    ADAMANTINE_INGOT: {
      physDamage: 30,
      physHitRating: 50,
      physCritRating: 50,
      physCritDamage: 50,
      physPenetration: 25,
    },
  },

  SHIELD: {
    IRON_INGOT: {
      armor: 10,
    },

    COPPER_INGOT: {
      armor: 15,
      healthRegen: 5,
    },

    SILVER_INGOT: {
      armor: 20,
      magicResistance: 15,
    },

    GOLD_INGOT: {
      magicResistance: 25,
      maxMana: 40,
    },

    MITHRIL_INGOT: {
      armor: 25,
      magicResistance: 20,
      evasion: 10,
    },

    ADAMANTINE_INGOT: {
      armor: 50,
      maxHealth: 80,
      magicResistance: 30,
    },
    REGULAR_PLANK: {
      armor: 5,
    },

    PINE_PLANK: {
      armor: 6,
      maxMana: 30,
      manaRegen: 5,
    },

    OAK_PLANK: {
      armor: 10,
      maxHealth: 20,
    },

    ASH_PLANK: {
      armor: 8,
      evasion: 10,
    },

    YEW_PLANK: {
      armor: 7,
      evasion: 15,
    },

    MAHOGANY_PLANK: {
      magicResistance: 15,
      maxMana: 50,
    },

    EBONY_PLANK: {
      magicResistance: 20,
    },

    BLOOD_PLANK: {
      maxHealth: 30,
      healthRegen: 10,
    },

    GHOST_PLANK: {
      magicResistance: 25,
      evasion: 10,
    },
  },
  ARMOR: {
    PLATE: {
      IRON_INGOT: {
        armor: 15,
      },

      COPPER_INGOT: {
        armor: 20,
        maxHealth: 20,
      },

      SILVER_INGOT: {
        armor: 20,
        magicResistance: 20,
      },

      GOLD_INGOT: {
        armor: 18,
        magicResistance: 30,
        maxMana: 30,
      },

      MITHRIL_INGOT: {
        armor: 25,
        maxHealth: 40,
        magicResistance: 20,
        manaRegen: -5,
        dexterity: -5,
      },

      ADAMANTINE_INGOT: {
        armor: 40,
        maxHealth: 80,
        magicResistance: 30,
        manaRegen: -10,
        dexterity: -10,
      },
    },
    MAIL: {
      IRON_INGOT: {
        armor: 10,
        physHitRating: 10,
      },

      COPPER_INGOT: {
        armor: 12,
        physHitRating: 15,
      },

      SILVER_INGOT: {
        armor: 12,
        physHitRating: 25,
      },

      GOLD_INGOT: {
        armor: 12,
        physCritRating: 20,
        magicResistance: 15,
      },

      MITHRIL_INGOT: {
        armor: 18,
        physHitRating: 20,
        physCritRating: 15,
      },

      ADAMANTINE_INGOT: {
        armor: 25,
        physHitRating: 25,
        physCritRating: 20,
        maxHealth: 20,
      },
    },
    LEATHER: {
      REGULAR_LEATHER: {
        evasion: 10,
      },

      ROUGH_LEATHER: {
        evasion: 15,
        dexterity: 5,
      },

      REPTILE_LEATHER: {
        evasion: 20,
        physCritRating: 20,
      },

      IRON_LEATHER: {
        evasion: 15,
        armor: 15,
      },

      DEMON_LEATHER: {
        evasion: 25,
        physDamage: 15,
        physCritDamage: 20,
      },

      DRAGON_LEATHER: {
        evasion: 30,
        physDamage: 20,
        physCritRating: 25,
        physCritDamage: 25,
      },
    },
    CLOTH: {
      REGULAR_CLOTH: {
        maxMana: 40,
        manaRegen: 5,
      },
    },
  },

  STAFF: {
    REGULAR_PLANK: {
      spellDamage: 5,
    },

    PINE_PLANK: {
      spellDamage: 6,
      manaRegen: 5,
    },

    OAK_PLANK: {
      spellDamage: 6,
      maxHealth: 20,
    },

    ASH_PLANK: {
      spellHitRating: 20,
    },

    YEW_PLANK: {
      spellCritRating: 20,
      spellCritDamage: 20,
    },

    MAHOGANY_PLANK: {
      maxMana: 50,
      manaRegen: 10,
    },

    EBONY_PLANK: {
      spellDamage: 15,
      spellPenetration: 15,
    },

    BLOOD_PLANK: {
      spellDamage: 12,
      healthRegen: 10,
    },

    GHOST_PLANK: {
      spellDamage: 18,
      spellHitRating: 25,
      spellCritRating: 25,
    },
  },
};
