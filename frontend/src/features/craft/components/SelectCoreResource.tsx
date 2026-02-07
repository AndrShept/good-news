import { GameItemImg } from '@/components/GameItemImg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { GameItemSlot } from '@/features/item-instance/components/GameItemSlot';
import { imageConfig } from '@/shared/config/image-config';
import { ResourceCategoryType, SelectCoreResourceBuildingType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { X } from 'lucide-react';
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
    BLACKSMITH: imageConfig.icon.RESOURCES['IRON_INGOT'],
    TAILOR: imageConfig.icon.RESOURCES['REGULAR_LEATHER'],
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
      <PopoverContent side="top" className="bg-secondary/70 flex w-fit select-none items-center gap-1 rounded p-1">
        {items?.map(([id, amount]) => {
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
};
