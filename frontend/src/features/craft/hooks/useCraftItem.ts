import { ShieldNameType } from '@/shared/config/craft-config';
import { CraftItem, IngotType, LeatherType, Modifier, ResourceType } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCraftDataOptions } from '../api/get-craft-data';
import { getCraftItemOptions } from '../api/get-craft-item';

export const useCraftItem = () => {
  const queryClient = useQueryClient();
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const craftData = queryClient.getQueryData(getCraftDataOptions().queryKey);
  const craftItems = queryClient.getQueryData(getCraftItemOptions(selectBuilding?.type).queryKey);
  const filteredResourcesBySelectBuilding = useMemo(() => {
    return craftData?.resources.filter((r) => r.category === selectBuilding?.workingResourceCategory);
  }, [craftData?.resources, selectBuilding?.workingResourceCategory]);
  const craftItemMap = useMemo(() => {
    if (!craftItems) return {};

    return craftItems.reduce(
      (acc, item) => {
        if (!item) return acc;
        acc[item.id] = item;
        return acc;
      },
      {} as Record<string, CraftItem>,
    );
  }, [craftItems]);

  const resourceMap = useMemo(
    () =>
      craftData?.resources?.reduce(
        (acc, item) => {
          if (!item?.gameItem) return acc;
          const typedKey = item.type as ResourceType;
          acc[typedKey] = { image: item.gameItem.image, modifier: item.modifier ? item.modifier : null };
          return acc;
        },
        {} as Record<ResourceType, { image: string; modifier: Modifier | null }>,
      ),
    [craftData?.resources],
  );

  const getCraftItemRequirement = (gameItem: GameItem | undefined | null, coreMaterialType: ResourceType | undefined | null) => {
    if (!gameItem) return;

    const { type, name, armor, weapon } = gameItem;

    if (type === 'WEAPON') {
      if (!coreMaterialType) return;
      if (!weapon) {
        console.error('getCraftItemRequirement gameItem.weapon not found ');
        return;
      }

      return craftData?.craftConfig[type][weapon.weaponType][coreMaterialType as IngotType];
    }
    if (type === 'ARMOR') {
      if (!coreMaterialType) return;
      if (!armor) {
        console.error('getCraftItemRequirement gameItem.armor not found ');
        return;
      }

      return craftData?.craftConfig[type][armor.type][coreMaterialType as LeatherType | IngotType];
    }
    if (type === 'SHIELD') {
      if (!coreMaterialType) return;

      return craftData?.craftConfig[type][name as ShieldNameType][coreMaterialType as IngotType];
    }
    return craftData?.craftConfig[type][name];
  };

  const getMaterialModifier = (gameItem: GameItem, coreMaterialType: IngotType | LeatherType | undefined | null) => {
    if (!coreMaterialType) {
      console.error('getMaterialModifier coreMaterialType not found ');
      return;
    }

    const { type, armor, weapon } = gameItem;

    if (type === 'WEAPON') {
      if (!weapon) {
        console.error('getMaterialModifier gameItem.weapon not found ');
        return;
      }

      return craftData?.materialModifierConfig[type][coreMaterialType as IngotType];
    }
    if (type === 'ARMOR') {
      if (!armor) {
        console.error('getMaterialModifier gameItem.armor not found ');
        return;
      }
      const armorType = armor.type;
      if (armorType === 'PLATE' || armorType === 'MAIL') {
        return craftData?.materialModifierConfig.ARMOR[armorType][coreMaterialType as IngotType];
      }

      if (armorType === 'LEATHER' || armorType === 'CLOTH') {
        return craftData?.materialModifierConfig.ARMOR[armorType][coreMaterialType as LeatherType];
      }
    }
    if (type === 'SHIELD') {
      return craftData?.materialModifierConfig[type][coreMaterialType as IngotType];
    }
  };

  const allResourcesByType = useMemo(() => {
    return craftData?.resources?.map((resource) => resource.type);
  }, [craftData?.resources]);

  return {
    craftItemMap,
    resourceMap,
    getCraftItemRequirement,
    getMaterialModifier,
    filteredResourcesBySelectBuilding,
    allResourcesByType,
  };
};
