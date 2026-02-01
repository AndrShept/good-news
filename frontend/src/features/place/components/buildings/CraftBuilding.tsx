import { getCraftRecipeOptions } from '@/features/craft/api/get-craft-recipe';
import { CraftButton } from '@/features/craft/components/CraftButton';
import { CraftRecipeItemCard } from '@/features/craft/components/CraftRecipeItemCard';
import { CraftSidebar } from '@/features/craft/components/CraftSidebar';
import { SelectCoreResource } from '@/features/craft/components/SelectCoreResource';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { QueueCraftItemsList } from '@/features/queue/components/QueueCraftItemsList';
import { CraftBuildingType, SelectCoreResourceBuildingType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const CraftBuilding = () => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const heroId = useHeroId();
  const { data: recipeIds, isLoading } = useQuery(getCraftRecipeOptions(heroId, selectBuilding?.type));
  const { recipeId, setRecipeId } = useCraftItemStore();
  const canSelectCoreResource = selectBuilding?.type === 'TAILOR' || selectBuilding?.type === 'BLACKSMITH';

  useEffect(() => {
    setRecipeId(recipeIds?.[0]?.recipeId);
  }, [recipeIds, selectBuilding?.type]);
  if (isLoading) return <p>...</p>;
  return (
    <section className="flex w-full">
      <CraftSidebar recipeIds={recipeIds} onSelect={setRecipeId} selectedItemId={recipeId} />
      <div className="flex flex-1 flex-col min-w-0 items-center gap-1 p-1">
        <div className="min-h-0 flex-1">{recipeId && <CraftRecipeItemCard recipeId={recipeId} />}</div>

        <QueueCraftItemsList />
        {canSelectCoreResource && <SelectCoreResource type={selectBuilding.type as unknown as SelectCoreResourceBuildingType} />}
        {selectBuilding?.type && (
          <div className="mx-auto">
            <CraftButton recipeId={recipeId ?? ''} buildingType={selectBuilding.type as unknown as CraftBuildingType} />
          </div>
        )}
      </div>
    </section>
  );
};
