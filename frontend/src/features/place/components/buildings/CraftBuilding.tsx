import { getCraftRecipeOptions } from '@/features/craft/api/get-craft-recipe';
import { CraftButton } from '@/features/craft/components/CraftButton';
import { CraftRecipeItemCard } from '@/features/craft/components/CraftRecipeItemCard';
import { CraftSidebar } from '@/features/craft/components/CraftSidebar';
import { SelectCoreResource } from '@/features/craft/components/SelectCoreResource';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { QueueCraftItemsList } from '@/features/queue/components/QueueCraftItemsList';
import { Building, CraftBuildingKey, SelectCoreResourceBuildingKey } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const CraftBuilding = ({ selectedBuilding }: { selectedBuilding: Building }) => {
  const heroId = useHeroId();
  const { data: recipeIds, isLoading } = useQuery(getCraftRecipeOptions(heroId, selectedBuilding.key));
  const { recipeId, setRecipeId } = useCraftItemStore();

  useEffect(() => {
    setRecipeId(recipeIds?.[0]?.recipeId);
  }, [recipeIds, setRecipeId]);
  if (isLoading) return <p>...</p>;
  return (
    <section className="flex w-full">
      <CraftSidebar recipeIds={recipeIds} onSelect={setRecipeId} selectedItemId={recipeId} />
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 p-1">
        <div className="min-h-0 flex-1">{recipeId && <CraftRecipeItemCard recipeId={recipeId} />}</div>

        <QueueCraftItemsList />
        {canSelectCoreResource && <SelectCoreResource type={selectBuilding.key as unknown as SelectCoreResourceBuildingKey} />}
        {selectBuilding?.key && (
          <div className="mx-auto">
            <CraftButton recipeId={recipeId ?? ''} buildingType={selectBuilding.key as unknown as CraftBuildingKey} />
          </div>
        )}
      </div>
    </section>
  );
};
