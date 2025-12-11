import { CraftItem, GameItem, IngotType, LeatherType, Modifier, ResourceType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCraftItemOptions } from '../api/get-craft-item';

export const useCraftItem = () => {
  const queryClient = useQueryClient();
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const data = queryClient.getQueryData(getCraftItemOptions(selectBuilding?.type).queryKey);
  const coreMaterialType = useCraftItemStore((state) => state.coreMaterialType);
  const filteredResourcesBySelectBuilding = useMemo(() => {
    return data?.resources.filter((r) => r.category === selectBuilding?.workingResourceCategory);
  }, [data?.resources, selectBuilding?.workingResourceCategory]);
  const craftItemMap = useMemo(() => {
    if (!data) return {};

    return data.craftItems.reduce(
      (acc, item) => {
        if (!item) return acc;
        acc[item.id] = item;
        return acc;
      },
      {} as Record<string, CraftItem>,
    );
  }, [data]);

  const resourceMap = useMemo(
    () =>
      data?.resources?.reduce(
        (acc, item) => {
          if (!item?.gameItem) return acc;
          const typedKey = item.type as ResourceType;
          acc[typedKey] = { image: item.gameItem.image, modifier: item.modifier ? item.modifier : null };
          return acc;
        },
        {} as Record<ResourceType, { image: string; modifier: Modifier | null }>,
      ),
    [data?.resources],
  );

  function getCraftItemRequirement(gameItem: GameItem | undefined | null, coreMaterialType: ResourceType | undefined | null) {
    if (!gameItem) return;

    const { type, name, armor, weapon } = gameItem;

    if (type === 'WEAPON') {
      if (!coreMaterialType) return;
      if (!weapon) {
        console.error('getCraftItemRequirement gameItem.weapon not found ');
        return;
      }

      return data?.craftConfig[type][weapon.weaponType][coreMaterialType as IngotType];
    }
    if (type === 'ARMOR') {
      if (!coreMaterialType) return;
      if (!armor) {
        console.error('getCraftItemRequirement gameItem.armor not found ');
        return;
      }

      return data?.craftConfig[type][armor.type][coreMaterialType as LeatherType | IngotType];
    }
    return data?.craftConfig[type][name];
  }

  const allResourcesByType = useMemo(() => {
    return data?.resources?.map((resource) => resource.type);
  }, [data?.resources]);

  return {
    craftItemMap,
    resourceMap,
    getCraftItemRequirement,
    filteredResourcesBySelectBuilding,
    allResourcesByType,
  };
};
