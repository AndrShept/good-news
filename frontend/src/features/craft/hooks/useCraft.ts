import { useGameData } from '@/features/hero/hooks/useGameData';
import { BuildingType } from '@/shared/types';

export const useCraft = (buildingType: BuildingType | undefined | null) => {
  const data = useGameData();
  const filteredByType = data.itemsTemplate?.filter((item) => item.type === 'RESOURCES');
  const filterResourceByBuilding = filteredByType?.filter((r) => {
    switch (buildingType) {
      case 'BLACKSMITH':
        return r.resourceInfo.category === 'ORE';
      default:
        return false;
    }
  });

  return {
    filterResourceByBuilding,
  };
};
