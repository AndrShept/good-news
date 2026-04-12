import { Button } from '@/components/ui/button';
import { ShopItems } from '@/features/shop/components/ShopItems';
import { parentVariants } from '@/lib/config';
import { NPC_SHOP_TABLE } from '@/shared/table/npc-shop-table';
import { Building, CraftBuildingKey, NPC, RefiningBuildingKey, TPlace, craftBuildingValues, refiningBuildingValues } from '@/shared/types';
import { useSelectPlaceEntitiesStore } from '@/store/useSelectBuildingStore';
import * as m from 'motion/react-m';
import { useEffect, useState } from 'react';

import { Bank } from './buildings/Bank';
import { CraftBuilding } from './buildings/CraftBuilding';
import { RefiningBuilding } from './buildings/RefiningBuilding';
import { Temple } from './buildings/Temple';
import { BuyShopHeader } from './npc/BuyShopHeader';
import { NpcBuy } from './npc/NpcBuy';
import { NpcGreeting } from './npc/NpcGreeting';
import { NpcSell } from './npc/NpcSell';

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

const shopStateValues = ['BUY', 'SELL', 'QUEST'] as const;
export type ShopStateType = (typeof shopStateValues)[number];
const SelectPlaceNpc = ({ selectedNpc }: { selectedNpc: NPC }) => {
  const shop = NPC_SHOP_TABLE[selectedNpc.id];
  const [shopState, setShopState] = useState<ShopStateType | null>(null);

  return (
    <m.section variants={parentVariants} initial="hidden" animate="visible" className="mx-auto w-full flex flex-col gap-1 max-w-2xl">
      {shopState && <BuyShopHeader setShopState={setShopState} />}
      {!shopState && (
        <div>
          <NpcGreeting npc={selectedNpc} />
          <ul className="ml-10 mt-5 flex w-fit flex-col gap-1">
            {shopStateValues.map((v, idx) => (
              <Button
                onClick={() => setShopState(v)}
                variant={'link'}
                key={v}
                className="text-muted-foreground hover:text-foreground justify-start text-xl capitalize"
              >
                <span> {idx + 1}. </span>
                <span className=""> {v.toLowerCase()}</span>
              </Button>
            ))}
          </ul>
        </div>
      )}
      {shopState === 'BUY' && <NpcBuy sellItems={shop.sells} npc={selectedNpc} />}
      {shopState === 'SELL' && <NpcSell />}
    </m.section>
  );
};
