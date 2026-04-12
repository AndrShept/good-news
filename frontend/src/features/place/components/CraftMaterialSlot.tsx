import { GameItemImg } from '@/components/GameItemImg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { GameItemSlot } from '@/features/item-instance/components/GameItemSlot';
import { TINT_COLOR } from '@/lib/config';
import { imageConfig } from '@/shared/config/image-config';
import { ColoredResourceCategoryType, ColoredResourceType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { X } from 'lucide-react';
import { useState } from 'react';

const slotImage = {
  INGOT: imageConfig.icon.RESOURCES.INGOT,
  LEATHER: imageConfig.icon.RESOURCES.LEATHER,
  CLOTH: imageConfig.icon.RESOURCES.CLOTH,
  PLANK: imageConfig.icon.RESOURCES.PLANK,
  BONE: imageConfig.icon.RESOURCES.BONE,
  CURED_FUR: imageConfig.icon.RESOURCES.BONE,
} satisfies Record<ColoredResourceCategoryType, string>;

export const CraftMaterialSlot = ({ recipeId }: { recipeId: string }) => {
  const { getStackedResourceItemsByCategory } = useHeroBackpack();
  const { itemsTemplateById, recipeTemplateById } = useGameData();
  const { coreResourceId, setCoreResourceId } = useCraftItemStore();
  const [isOpen, setIsOpen] = useState(false);
  const recipe = recipeTemplateById[recipeId];
  const coreMaterials = recipe.requirement.materials.filter((i) => i.role !== 'FIXED');
  return (
    <>
      {coreMaterials.map((m) => {
        if (!m.categories) return;
        const stackedItems = getStackedResourceItemsByCategory(m.categories);
        const items = stackedItems ? Object.entries(stackedItems) : [];
        return (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>
              <GameItemSlot key={m.templateId}>
                {coreResourceId && !!stackedItems?.[coreResourceId] ? (
                  <div className="relative">
                    <GameItemImg
                      tintColor={coreResourceId ? TINT_COLOR[itemsTemplateById[coreResourceId].key as ColoredResourceType] : null}
                      className="group-hover:saturate-110 size-full group-hover:opacity-100"
                      image={itemsTemplateById[coreResourceId].image}
                    />

                    <div className="absolute bottom-0 right-1 text-[12px] font-semibold"> {stackedItems?.[coreResourceId]}</div>
                  </div>
                ) : (
                  <GameItemImg
                    tintColor={null}
                    className="opacity-20 saturate-0 group-hover:opacity-20"
                    image={slotImage[m.categories[0]]}
                  />
                )}
              </GameItemSlot>
            </PopoverTrigger>
            <PopoverContent side="top" className="bg-secondary/90 flex w-fit max-w-xs select-none flex-wrap items-center gap-1 rounded p-1">
              {items?.map(([id, amount]) => {
                const template = itemsTemplateById[id];

                return (
                  <div
                    key={id}
                    onClick={() => {
                      setCoreResourceId(id);
                      setIsOpen(false);
                    }}
                 
                    className="group relative opacity-80"
                  >
                    <GameItemImg
                      tintColor={TINT_COLOR[template.key as ColoredResourceType]}
                      className="group-hover:saturate-110 size-10 group-hover:opacity-100"
                      image={template.image}
                    />

                    {<div className="absolute bottom-0 right-1 text-[12px] font-semibold">{amount}</div>}
                  </div>
                );
              })}
              <GameItemSlot className="flex size-10 border-none">
                <X
                  onClick={() => {
                    setCoreResourceId(undefined);
                    setIsOpen(false);
                  }}
                  className="m-auto size-10 text-red-500/30 hover:text-red-500/50"
                />
              </GameItemSlot>
            </PopoverContent>
          </Popover>
        );
      })}
    </>
  );
};
