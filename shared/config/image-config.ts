import type { ArmorSlotType, ResourceType, SkillType, WeaponType } from '../types';

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
      skill: '/sprites/icons/ui/skill.png',
    },
    skill: {
      BLACKSMITHING: '/sprites/icons/skills/blacksmithing.png',
      ALCHEMY: '/sprites/icons/skills/alchemy.png',
      MINING: '/sprites/icons/skills/mining.png',
      SMELTING: '/sprites/icons/skills/smelting.png',
      TAILORING: '/sprites/icons/skills/tailoring.png',
      REGENERATION: '/sprites/icons/skills/regeneration.png',
      MEDITATION: '/sprites/icons/skills/meditation.png',
    } as Record<SkillType, string>,
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
      CHEST: '/sprites/icons/armor/chest.png',
      GLOVES: '/sprites/icons/armor/gloves.png',
      HELMET: '/sprites/icons/armor/helmet.png',
      SHIELD: '/sprites/icons/armor/shield.png',
    } as Record<ArmorSlotType, string>,
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
      'IRON-ORE': '/sprites/icons/resources/ores/iron-ore.png',
      'COPPER-ORE': '/sprites/icons/resources/ores/copper-ore.png',
      'SILVER-ORE': '/sprites/icons/resources/ores/silver-ore.png',
      'GOLD-ORE': '/sprites/icons/resources/ores/gold-ore.png',
      'MITHRIL-ORE': '/sprites/icons/resources/ores/mithril-ore.png',
      'ADAMANTINE-ORE': '/sprites/icons/resources/ores/adamantine-ore.png',

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
