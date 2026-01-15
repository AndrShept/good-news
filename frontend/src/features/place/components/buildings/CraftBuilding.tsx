import { getCraftRecipeOptions } from '@/features/craft/api/get-craft-recipe';
import { CraftButton } from '@/features/craft/components/CraftButton';
import { CraftRecipeItemCard } from '@/features/craft/components/CraftRecipeItemCard';
import { CraftSidebar } from '@/features/craft/components/CraftSidebar';
import { useCraft } from '@/features/craft/hooks/useCraft';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const CraftBuilding = () => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const heroId = useHeroId();
  const { data: recipeIds, isLoading } = useQuery(getCraftRecipeOptions(heroId, selectBuilding?.type));
  const { recipeId, setCoreMaterialId, setRecipeId } = useCraftItemStore();

  const { filterResourceByBuilding } = useCraft(selectBuilding?.type);
  useEffect(() => {
    setRecipeId(recipeIds?.[0]?.recipeId);
    if (selectBuilding?.type === 'BLACKSMITH') {
      setCoreMaterialId(filterResourceByBuilding?.[0].id);
    } else {
      setCoreMaterialId(undefined);
    }
  }, [recipeIds, selectBuilding?.type, setCoreMaterialId, setRecipeId]);
  if (isLoading) return <p>...</p>;
  return (
    <section className="flex w-full">
      <CraftSidebar recipeIds={recipeIds} onSelect={setRecipeId} selectedItemId={recipeId} />
      <div className="flex flex-1 flex-col p-1">
        <div className="min-h-0 flex-1">{recipeId && <CraftRecipeItemCard recipeId={recipeId} />}</div>

        {/* <QueueCraftItemsList /> */}

        <div className="mx-auto w-[200px] p-3">
          <CraftButton recipeId={recipeId ?? ''} buildingType={selectBuilding?.type} />
        </div>
      </div>
    </section>
  );
};
