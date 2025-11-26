import { Place } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';

import { CraftBuilding } from './buildings/CraftBuilding';
import { MagicShop } from './buildings/MagicShop';
import { Temple } from './buildings/Temple';

type Props = {
  place: Place | undefined | null;
};

export const SelectedBuildingPage = ({ place }: Props) => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const isMagicShop = selectBuilding?.type === 'MAGIC-SHOP';
  const isTemple = selectBuilding?.type === 'TEMPLE';
  const isCraftBuilding = selectBuilding?.type === 'BLACKSMITH' || selectBuilding?.type === 'FORGE';
  return (
    <section className="flex flex-1 p-1.5">
      {!selectBuilding && <p>{place?.name}</p>}
      {isMagicShop && <MagicShop />}
      {isTemple && <Temple />}
      <CraftBuilding isCraftBuilding={isCraftBuilding} />
    </section>
  );
};
