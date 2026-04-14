import { NPC_SHOP_TABLE } from '@/shared/table/npc-shop-table';
import { npcTemplate } from '@/shared/templates/npc-template';
import type { ItemsInstanceDeltaEvent, ShopCartItem } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemTemplateService } from './item-template-service';

interface BuyItems {
  heroId: string;
  backpackId: string;
  npcId: string;
  items: ShopCartItem[];
}
interface SellItems {
  heroId: string;
  backpackId: string;
  npcId: string;
  items: ShopCartItem[];
}

export const npcService = {
  getNpc(npcId: string) {
    const npc = npcTemplate.find((n) => n.id === npcId);
    if (!npc) {
      throw new HTTPException(400, { message: 'npc not found' });
    }
    return npc;
  },
  getNpcShopTable(npcId: string) {
    return NPC_SHOP_TABLE[npcId];
  },
  getItemPrice(npcId: string, itemTemplateId: string, action: 'buy' | 'sell') {
    const NPC_TABLE = this.getNpcShopTable(npcId);
    const price =
      action === 'buy'
        ? NPC_TABLE.sells.find((i) => i.itemTemplateId === itemTemplateId)?.price
        : NPC_TABLE.buys.find((i) => i.itemTemplateId === itemTemplateId)?.price;

    if (!price) {
      throw new HTTPException(400, { message: 'price not found' });
    }
    return price;
  },
  assertItemsInNpcTable(npcId: string, items: ShopCartItem[], action: 'buy' | 'sell') {
    const NPC_TABLE = this.getNpcShopTable(npcId);
    const npcTableItems = action === 'buy' ? NPC_TABLE.sells : NPC_TABLE.buys;
    const itemExistInTable = items.every((i) => npcTableItems.some((b) => b.itemTemplateId === i.id));
    if (!itemExistInTable) {
      throw new HTTPException(409, { message: `npc does not ${action === 'buy' ? 'sell' : 'buy'}} this item` });
    }
  },
  buyItems({ backpackId, heroId, npcId, items }: BuyItems) {
    const result: {
      messageData: { name: string; quantity: number }[];
      itemsDelta: ItemsInstanceDeltaEvent[];
    } = {
      messageData: [],
      itemsDelta: [],
    };
    const { needCapacity, sumPriceGold } = items.reduce(
      (acc, item) => {
        const template = itemTemplateService.getAllItemsTemplateMapIds()[item.id];
        const buyPrice = npcService.getItemPrice(npcId, item.id, 'buy');
        acc.sumPriceGold += item.quantity * buyPrice;
        if (!template.stackable) {
          acc.needCapacity += item.quantity;
        } else {
          acc.needCapacity += Math.ceil(item.quantity / (template.maxStack ?? 1));
        }
        return acc;
      },
      { sumPriceGold: 0, needCapacity: 0 },
    );
    heroService.checkFreeBackpackCapacity(heroId, needCapacity);

    npcService.assertItemsInNpcTable(npcId, items, 'buy');

    heroService.assertHasEnoughGold(heroId, sumPriceGold);

    heroService.spendGold(heroId, sumPriceGold);
    for (const item of items) {
      const template = itemTemplateService.getAllItemsTemplateMapIds()[item.id];
      const itemDelta = itemContainerService.createItem({
        heroId: heroId,
        itemContainerId: backpackId,
        itemTemplateId: template.id,
        quantity: item.quantity,
        coreResourceId: undefined,
        isAddPendingEvents: true,
      });
      result.messageData.push({ name: template.name, quantity: item.quantity });
      result.itemsDelta.push(...itemDelta);
    }
    return result;
  },
  sellItems({ backpackId, heroId, npcId, items }: SellItems) {
    const result: {
      messageData: { name: string; quantity: number }[];
      itemsDelta: ItemsInstanceDeltaEvent[];
    } = {
      messageData: [],
      itemsDelta: [],
    };
    const hero = heroService.getHero(heroId);
    const sumPrice = items.reduce((acc, item) => {
      const price = npcService.getItemPrice(npcId, item.id, 'sell');
      acc += price * item.quantity;
      return acc;
    }, 0);
    const backpack = itemContainerService.getBackpack(heroId);
    npcService.assertItemsInNpcTable(npcId, items, 'sell');
    const itemExistInBackpack = items.every((i) =>
      backpack.itemsInstance.some((b) => b.id === i.itemInstanceId && b.quantity === i.quantity),
    );
    if (!itemExistInBackpack) {
      throw new HTTPException(409, { message: 'item not sell' });
    }
    for (const item of items) {
      if (!item.itemInstanceId) throw new HTTPException(400, { message: 'itemInstanceId not found' });
      const itemTemplate = itemTemplateService.getTemplateByItemTemplateId(item.id);
      const deltaItem = itemContainerService.consumeItem({
        mode: 'use',
        itemContainerId: backpackId,
        itemInstanceId: item.itemInstanceId,
        quantity: item.quantity,
      });
      result.itemsDelta.push(...deltaItem);
      result.messageData.push({ name: itemTemplate.name, quantity: item.quantity });
    }
    hero.goldCoins += sumPrice;
    return result;
  },
};
