import { Place } from '@/shared/types';

import { MagicShop } from './buildings/MagicShop';
import { Temple } from './buildings/Temple';

type Props = {
  buildingId: string;
  place: Place | undefined | null;
};

export const SelectedBuildingPage = ({ buildingId, place }: Props) => {
  const building = place?.buildings?.find((b) => b.id === buildingId);
  const isMagicShop = building?.type === 'MAGIC-SHOP';
  const isTemple = building?.type === 'TEMPLE';
  return (
    <section className="flex flex-1 p-1.5">
      {!buildingId && <p>{place?.name}</p>}
      {isMagicShop && <MagicShop />}
      {isTemple && <Temple />}
    </section>
  );
};
