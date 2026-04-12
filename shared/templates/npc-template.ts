import { imageConfig } from '@/shared/config/image-config';
import type { NPC, NPCType } from '@/shared/types';

const createNpc = (id: string, type: NPCType, key: string, image: string, greetings: string[]): NPC => ({
  id,
  key,
  name: key.toLowerCase().replace(/_/g, ' '),
  image,
  type,
  greetings,
});

export const npcTemplate = [
  createNpc(
    '019d78f1-609a-7d97-af2b-9155d9359256',
    'ALCHEMIST',
    'VEX_ALCHEMIST',
    imageConfig.npc.vex,
    [
      "Ah, another soul seeking the secrets of herbs and shadows. Tell me, traveler — what brew do you seek today?",
      "The mushrooms you bring me... they whisper things. Curious things. Come in, come in.",
      "Not everyone who walks through my door leaves the same. What is it you need?",
      "I was just grinding some ghost herbs. Potent stuff — handle with care. Now, what brings you here?",
      "You smell of the forest. Good. That means you've been busy. Let's see what I can offer you.",
      "Potions don't brew themselves, but I do wish they would. What can I do for you?",
      "Every ingredient tells a story. Yours look... interesting. Shall we trade?",
      "Careful near the shelf — that vial is older than the town itself. Now, what do you need?",
    ],
  ),
  createNpc(
    '019d78f2-d3de-7f28-9cbb-6b3948dac739',
    'BLACKSMITH',
    'ALDRIC_BLACKSMITH',
    imageConfig.npc.aldric,
    [
      "The forge never sleeps, and neither do I. What do you need — a blade sharp enough to split shadow, or armor that'll hold against the worst?",
      "Good steel speaks for itself. Let me know what you're after.",
      "Another adventurer, another dent to fix. What happened this time?",
      "I've shaped iron from the deepest caves into weapons that changed the course of battles. What can I make for you?",
      "My father taught me this trade, and his father before him. You won't find better work in this region.",
      "The fire's hot and my hammer is ready. Speak your need.",
      "Iron, gold — I've worked them all. What do you bring me today?",
      "A weapon is only as good as the hand that wields it. But I'll make sure the weapon is worthy of yours.",
      "Don't let the soot fool you — every piece I forge is a work of craft. What'll it be?",
    ],
  ),
  createNpc(
    '019d78f2-eaa4-712e-b3a1-440b4b1c24b4',
    'COOK',
    'MARIA_COOK',
    imageConfig.npc.maria,
    [
      "Welcome, dear! Sit down, the soup is still warm. Or perhaps you brought me something fresh from the waters today?",
      "Oh, you're back! I just finished a new batch — come, try something before you head out again.",
      "A full stomach makes a braver adventurer. What can I get for you?",
      "Fresh catch today? Wonderful — I have just the recipe for that.",
      "Don't be shy, there's always something on the fire here.",
      "You look hungry. That's easy enough to fix — let me see what we have.",
      "I always say, the best armor is a good meal. Now, what are you in the mood for?",
      "Salmon again? I have five different ways to prepare it. Pick your favorite.",
      "Come in, come in! The wind out there is bitter — let me warm you up with something good.",
      "I hear you've been deep in the dark forest. You'll need something hearty to recover from that.",
    ],
  ),
  createNpc(
    '019d78f2-ff60-7e3a-a005-776cacc6a47f',
    'INSCRIBER',
    'LYRA_INSCRIBER',
    imageConfig.npc.lyra,
    [
      "Every skill worth having was written down by someone wiser. Browse carefully — the right book could change everything for you.",
      "Knowledge is the only thing that can't be stolen from you. What would you like to learn?",
      "I catalogued these books myself. Ask me anything — I know every page.",
      "The rarest skills are written in the rarest books. If you have the coin, I may have what you seek.",
      "Quiet, please — I'm in the middle of something important. But yes, I can help you.",
      "Most people underestimate what a good skill book can do. Don't be most people.",
      "I've read every book in this shop at least twice. Ask me what's worth your time.",
      "A sword rusts. A spell fades. But knowledge? Knowledge endures.",
      "Looking for something specific, or just browsing? Either way, you've come to the right place.",
    ],
  ),
  createNpc(
    '019d78f3-17a4-7b42-a1cf-cabf8b8601fa',
    'TINKER',
    'BROM_TINKER',
    imageConfig.npc.brom,
    [
      "Good tools make the difference between a poor haul and a great one. What are you after — a pickaxe, an axe, or perhaps a fishing rod?",
      "I fix what's broken and build what's needed. Simple as that. What'll it be?",
      "That pickaxe of yours looks worn down. Let me take a look at it.",
      "You can't mine mithril with an iron pick — trust me, I've seen people try. Upgrade before you head out.",
      "Every tool I sell is tested by my own hands. Nothing leaves this shop broken.",
      "Heading to the dark forest? You'll want a sharper axe than that one.",
      "I just got a fresh batch of fishing rods in — perfect balance, won't snap even on a shark.",
      "The right tool for the right job. Sounds simple, but most people get it wrong. Let me help.",
      "Durability matters more than people think. A tool that breaks mid-gather is worse than no tool at all.",
      "Come back when your tools wear out — I'll have something ready for you.",
    ],
  ),
] as const satisfies NPC[];

export const npcTemplateById = npcTemplate.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<string, NPC>,
);