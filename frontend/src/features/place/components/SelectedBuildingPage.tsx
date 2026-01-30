import { ShopItems } from '@/features/shop/components/ShopItems';
import { TPlace } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';

import { Bank } from './buildings/Bank';
import { CraftBuilding } from './buildings/CraftBuilding';
import { Temple } from './buildings/Temple';

type Props = {
  place: TPlace | undefined | null;
};

export const SelectedBuildingPage = ({ place }: Props) => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const isMagicShop = selectBuilding?.type === 'MAGIC-SHOP';
  const isTemple = selectBuilding?.type === 'TEMPLE';
  const isBank = selectBuilding?.type === 'BANK';
  const isCraftBuilding =
    selectBuilding?.type === 'BLACKSMITH' ||
    selectBuilding?.type === 'FORGE' ||
    selectBuilding?.type === 'ALCHEMY' ||
    selectBuilding?.type === 'TAILOR';
  return (
    <section className="flex min-w-0 flex-1 p-1.5">
      {!selectBuilding && <p>{place?.name}</p>}
      {isMagicShop && <ShopItems buildingType={selectBuilding.type} />}
      {isTemple && <Temple />}
      {isBank && <Bank place={place} />}
      {isCraftBuilding && <CraftBuilding />}
    </section>
  );
};
