import { Button } from '@/components/ui/button';
import { ShopItems } from '@/features/shop/components/ShopItems';
import { parentVariants } from '@/lib/config';
import { NPC_SHOP_TABLE } from '@/shared/table/npc-shop-table';
import {
  Building,
  CraftBuildingKey,
  NPC,
  RefiningBuildingKey,
  TPlace,
  craftBuildingValues,
  npcTabValues,
  refiningBuildingValues,
} from '@/shared/types';
import { useNpcActiveTabStore } from '@/store/useNpcActiveTabStore';
import { useNpcMessageStore } from '@/store/useNpcMessageStore';
import { useSelectPlaceEntitiesStore } from '@/store/useSelectBuildingStore';
import { useShopItemStore } from '@/store/useShopItemStore';
import * as m from 'motion/react-m';
import { useEffect, useState } from 'react';

import { Bank } from './buildings/Bank';
import { CraftBuilding } from './buildings/CraftBuilding';
import { RefiningBuilding } from './buildings/RefiningBuilding';
import { Temple } from './buildings/Temple';
import { NpcBuy } from './npc/NpcBuy';
import { NpcGreeting } from './npc/NpcGreeting';
import { NpcQuest } from './npc/NpcQuest';
import { NpcSell } from './npc/NpcSell';
import { ShopHeader } from './npc/ShopHeader';

type Props = {
  place: TPlace | undefined | null;
};

export const SelectedPlaceEntitiesPage = ({ place }: Props) => {
  const selectedPlaceEntities = useSelectPlaceEntitiesStore((state) => state.selectedPlaceEntities);

  return (
    <section className="flex min-w-0 flex-1 p-1.5">
      {!selectedPlaceEntities && <p>{place?.name}</p>}
      {selectedPlaceEntities?.type === 'BUILDING' && <SelectPlaceBuilding place={place} selectedBuilding={selectedPlaceEntities.payload} />}
      {selectedPlaceEntities?.type === 'NPC' && (
        <SelectPlaceNpc key={selectedPlaceEntities.payload.id} selectedNpc={selectedPlaceEntities.payload} />
      )}
    </section>
  );
};

const SelectPlaceBuilding = ({ selectedBuilding, place }: { selectedBuilding: Building; place: TPlace | null | undefined }) => {
  const isMagicShop = selectedBuilding.key === 'MAGIC_SHOP';
  const isTemple = selectedBuilding.key === 'TEMPLE';
  const isBank = selectedBuilding.key === 'BANK';
  const isCraftBuilding = selectedBuilding.key ? craftBuildingValues.includes(selectedBuilding.key as CraftBuildingKey) : false;
  const isRefiningBuilding = selectedBuilding.key ? refiningBuildingValues.includes(selectedBuilding.key as RefiningBuildingKey) : false;
  return (
    <div className="mx-auto w-full max-w-2xl">
      {isMagicShop && <ShopItems buildingType={selectedBuilding.key} />}
      {isTemple && <Temple />}
      {isBank && place && <Bank place={place} />}
      {isCraftBuilding && <CraftBuilding selectedBuilding={selectedBuilding} />}
      {isRefiningBuilding && place && <RefiningBuilding selectedBuilding={selectedBuilding} place={place} />}
    </div>
  );
};

const SelectPlaceNpc = ({ selectedNpc }: { selectedNpc: NPC }) => {
  const shop = NPC_SHOP_TABLE[selectedNpc.id];
  const { npcActiveTab, setNpcActiveTab } = useNpcActiveTabStore();
  const clearAllItems = useShopItemStore((state) => state.clearAllItems);

  const { setNpcMessage } = useNpcMessageStore();

  useEffect(() => {
    clearAllItems();
    setNpcActiveTab(null);

    const idx = Math.floor(Math.random() * selectedNpc.greetings.length);
    setNpcMessage(selectedNpc.greetings[idx]);
  }, [selectedNpc.id]);

  return (
    <m.section variants={parentVariants} initial="hidden" animate="visible" className="mx-auto flex w-full max-w-2xl flex-col gap-1">
      {npcActiveTab && <ShopHeader shopState={npcActiveTab} setShopState={setNpcActiveTab} />}

      {npcActiveTab === 'BUY' && <NpcBuy sellItems={shop?.sells ?? []} npc={selectedNpc} />}
      {npcActiveTab === 'SELL' && <NpcSell buyItems={shop?.buys ?? []} npc={selectedNpc} />}
      {npcActiveTab === 'QUEST' && <NpcQuest npc={selectedNpc} />}

      {!npcActiveTab && (
        <div>
          <NpcGreeting image={selectedNpc.image} name={selectedNpc.name} />
          <ul className="ml-10 mt-5 flex w-fit flex-col gap-1">
            {npcTabValues.map((v, idx) => (
              <li key={v} className="flex items-center">
                <span>{idx + 1}.</span>
                <Button
                  onClick={() => setNpcActiveTab(v)}
                  variant="link"
                  className="text-muted-foreground hover:text-foreground justify-start text-xl capitalize"
                >
                  {v.toLowerCase()}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </m.section>
  );
};
