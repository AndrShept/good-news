
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';

import { Bank } from './buildings/Bank';
import { CraftBuilding } from './buildings/CraftBuilding';
import { MagicShop } from './buildings/MagicShop';
import { Temple } from './buildings/Temple';
import { TPlace } from '@/shared/types';

type Props = {
  place: TPlace | undefined | null;
};

export const SelectedBuildingPage = ({ place }: Props) => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const isMagicShop = selectBuilding?.type === 'MAGIC-SHOP';
  const isTemple = selectBuilding?.type === 'TEMPLE';
  const isBank = selectBuilding?.type === 'BANK';
  const isCraftBuilding = selectBuilding?.type === 'BLACKSMITH' || selectBuilding?.type === 'FORGE';
  return (
    <section className="flex min-w-0 flex-1 p-1.5">
      {!selectBuilding && <p>{place?.name}</p>}
      {isMagicShop && <MagicShop />}
      {isTemple && <Temple />}
      {isBank && <Bank place={place} />}
      {isCraftBuilding && <CraftBuilding />}
    </section>
  );
};
