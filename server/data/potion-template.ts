import { imageConfig } from '@/shared/config/image-config'
import type { itemTemplateTable } from '../db/schema'
import { DEFAULT_ITEM_STACK } from '@/shared/constants'


export const potionTemplate = [
{
    id: '019a3500-856a-77a0-9cdb-6d7ba24d3f58',
    image: imageConfig.icon.POTION.buff.strength,
    name: 'strength potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 100,
    potionInfo: {
      type: 'BUFF',
      buffTemplateId: '019b946f-742c-7627-9de6-73af060a03e4'
    }

  },
{
    id: '019b94bf-87a4-7d81-809a-891133ed1264',
    image: imageConfig.icon.POTION.buff.constitution,
    name: 'constitution potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 100,
    potionInfo: {
      type: 'BUFF',
      buffTemplateId: '019b9470-df1c-7946-a8cf-1c4083a34253'
    }

  },
{
    id: '019b94c0-8d44-781a-8e28-4f21c2312f19',
    image: imageConfig.icon.POTION.buff.intelligence,
    name: 'intelligence potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 100,
    potionInfo: {
      type: 'BUFF',
      buffTemplateId: '019b94b9-0900-7d19-8f06-43a153ae7c94'
    }

  },
{
    id: '019b94c1-48b3-7466-873f-9e98bbabe3ca',
    image: imageConfig.icon.POTION.buff.dexterity,
    name: 'dexterity potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 100,
    potionInfo: {
      type: 'BUFF',
      buffTemplateId: '019b94b9-c90d-7961-a800-9213835a04ab'
    }

  },
{
    id: '019b94c2-032c-7199-aafc-adac4156454b',
    image: imageConfig.icon.POTION.buff.luck,
    name: 'luck potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 100,
    potionInfo: {
      type: 'BUFF',
      buffTemplateId: '019b94ba-985f-71b2-b657-549b6c411139'
    }

  },
{
    id: '019b94c3-26c8-7f32-8aff-6c3c619be13f',
    image: imageConfig.icon.POTION.restore.smallHealth,
    name: 'small health potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 40,
    potionInfo: {
      type: 'RESTORE',
      restore: { health: 50}
    }

  },
{
    id: '019b94c5-e0c8-7b6a-871e-344b3a6825be',
    image: imageConfig.icon.POTION.restore.smallMana,
    name: 'small mana potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 30,
    potionInfo: {
      type: 'RESTORE',
      restore: { mana: 70}
    }

  },
{
    id: '019b94dc-f13a-7065-bc19-54812d686d0d',
    image: imageConfig.icon.POTION.restore.smallRestore,
    name: 'small restore potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 55,
    potionInfo: {
      type: 'RESTORE',
      restore: { health: 35, mana: 40 }
    }

  },
{
    id: '019b94de-40d3-7325-bc62-b3de30b46b25',
    image: imageConfig.icon.POTION.restore.mediumHealth,
    name: 'medium health potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 70,
    potionInfo: {
      type: 'RESTORE',
      restore: { health: 100 }
    }

  },
{
    id: '019b94de-ef34-72dd-9952-763d5d16cfc9',
    image: imageConfig.icon.POTION.restore.mediumMana,
    name: 'medium mana potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 55,
    potionInfo: {
      type: 'RESTORE',
      restore: { mana: 150 }
    }

  },
{
    id: '019b94df-aa16-7cff-9152-f86be3a7df11',
    image: imageConfig.icon.POTION.restore.mediumRestore,
    name: 'medium restore potion',
    type: 'POTION',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.POTION,
    buyPrice : 85,
    potionInfo: {
      type: 'RESTORE',
      restore: { health: 70, mana: 90 }
    }

  },

] as const satisfies typeof itemTemplateTable.$inferInsert[]
  
 