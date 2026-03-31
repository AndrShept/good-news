import { ShopItems } from '@/features/shop/components/ShopItems';
import { Building, CraftBuildingKey, Npc, RefiningBuildingKey, TPlace, craftBuildingValues, refiningBuildingValues } from '@/shared/types';
import { useSelectPlaceEntitiesStore } from '@/store/useSelectBuildingStore';

import { Bank } from './buildings/Bank';
import { CraftBuilding } from './buildings/CraftBuilding';
import { RefiningBuilding } from './buildings/RefiningBuilding';
import { Temple } from './buildings/Temple';

type Props = {
  place: TPlace | undefined | null;
};

export const SelectedPlaceEntitiesPage = ({ place }: Props) => {
  const selectedPlaceEntities = useSelectPlaceEntitiesStore((state) => state.selectedPlaceEntities);

  return (
    <section className="flex min-w-0 flex-1 p-1.5">
      {!selectedPlaceEntities && <p>{place?.name}</p>}
      {selectedPlaceEntities?.type === 'BUILDING' && <SelectPlaceBuilding place={place} selectedBuilding={selectedPlaceEntities.payload} />}
      {selectedPlaceEntities?.type === 'NPC' && <SelectPlaceNpc selectedNpc={selectedPlaceEntities.payload} />}
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

const SelectPlaceNpc = ({ selectedNpc }: { selectedNpc: Npc }) => {
  return <div>NPC !!! {selectedNpc.name}</div>;
};
