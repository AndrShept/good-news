import { GameItemImg } from '@/components/GameItemImg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { GameItemSlot } from '@/features/item-instance/components/GameItemSlot';
import { imageConfig } from '@/shared/config/image-config';
import { ResourceCategoryType, SelectCoreResourceBuildingType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { useState } from 'react';

interface Props {
  type: SelectCoreResourceBuildingType;
}

export const SelectCoreResource = ({ type }: Props) => {
  const { getStackedResourceItemsByCategory } = useHeroBackpack();
  const { itemsTemplateById } = useGameData();
  const setCoreResourceId = useCraftItemStore((state) => state.setCoreResourceId);
  const coreResourceId = useCraftItemStore((state) => state.coreResourceId);
  const [isOpen, setIsOpen] = useState(false);
  const slotImage = {
    BLACKSMITH: imageConfig.icon.RESOURCES['IRON-INGOT'],
    TAILOR: imageConfig.icon.RESOURCES['REGULAR-LEATHER'],
  } satisfies Record<SelectCoreResourceBuildingType, string>;
  const craftCategory = {
    BLACKSMITH: 'INGOT',
    TAILOR: 'LEATHER',
  } satisfies Record<SelectCoreResourceBuildingType, ResourceCategoryType>;
  const stackedItems = getStackedResourceItemsByCategory(craftCategory[type]);
  const items = stackedItems ? Object.entries(stackedItems) : [];
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <GameItemSlot>
          {coreResourceId && !!stackedItems?.[coreResourceId] ? (
            <div className="relative">
              <GameItemImg
                className="group-hover:saturate-110 size-full group-hover:opacity-100"
                image={itemsTemplateById[coreResourceId].image}
              />

              <div className="absolute bottom-0 right-1 text-[12px] font-semibold"> {stackedItems?.[coreResourceId]}</div>
            </div>
          ) : (
            <GameItemImg className="opacity-20 saturate-0 group-hover:opacity-20" image={slotImage[type]} />
          )}
        </GameItemSlot>
      </PopoverTrigger>
      <PopoverContent className="flex w-fit select-none items-center gap-1 rounded-none p-1">
        {items.length > 0 ? (
          items.map(([id, amount]) => {
            const template = itemsTemplateById[id];
            if (template.resourceInfo?.category === craftCategory[type])
              return (
                <div
                  onClick={() => {
                    setCoreResourceId(id);
                    setIsOpen(false);
                  }}
                  key={id}
                  className="group relative opacity-80"
                >
                  <GameItemImg className="group-hover:saturate-110 size-10 group-hover:opacity-100" image={template.image} />

                  {<div className="absolute bottom-0 right-1 text-[12px] font-semibold">{amount}</div>}
                </div>
              );
          })
        ) : (
          <p>Missing required resources in backpack</p>
        )}
      </PopoverContent>
    </Popover>
  );
};
