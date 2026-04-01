import { getCraftRecipeOptions } from '@/features/place/api/get-craft-recipe';
import { CraftButton } from '@/features/place/components/CraftButton';
import { CraftMaterialSlot } from '@/features/place/components/CraftMaterialSlot';
import { CraftRecipeItemCard } from '@/features/place/components/CraftRecipeItemCard';
import { CraftSidebar } from '@/features/place/components/CraftSidebar';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { QueueCraftItemsList } from '@/features/queue/components/QueueCraftItemsList';
import { Building } from '@/shared/types';
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
        {recipeId && <CraftMaterialSlot recipeId={recipeId} />}
        {recipeId && (
          <div className="mx-auto">
            <CraftButton recipeId={recipeId} />
          </div>
        )}
      </div>
    </section>
  );
};
