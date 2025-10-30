import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DialogTitle } from '@/components/ui/dialog';
import { ApiGetCraftItemResponse, ArmorType, CraftItem, WeaponType } from '@/shared/types';
import { memo } from 'react';

import { CraftSelectResource } from './CraftSelectResource';

const icons: Record<WeaponType | ArmorType, string> = {
  SWORD: '/sprites/icons/shop/sword.png',
  AXE: '/sprites/icons/shop/axe.png',
  DAGGER: '/sprites/icons/shop/dagger.png',
  STAFF: '/sprites/icons/shop/staff.png',
  BOOTS: '/sprites/icons/shop/boots.png',
  CHESTPLATE: '/sprites/icons/shop/chestplate.png',
  GLOVES: '/sprites/icons/shop/gloves.png',
  HELMET: '/sprites/icons/shop/helmet.png',
  LEGS: '/sprites/icons/shop/legs.png',
  SHIELD: '/sprites/icons/shop/shield.png',
};

interface Props {
  data: ApiGetCraftItemResponse;
  onSelect: (item: CraftItem) => void;
}

export const CraftSidebar = memo(({ data, onSelect }: Props) => {
  return (
    <aside className="flex w-full max-w-[200px] flex-col border-r">
      {data?.craftItems.map((craftItem) => (
        <Accordion key={craftItem.itemType} type="multiple">
          <AccordionItem value="item-1">
            <DialogTitle></DialogTitle>
            <AccordionTrigger className="bg-secondary rounded-none p-3 capitalize">
              {craftItem.itemType.toLocaleLowerCase()}
            </AccordionTrigger>
            <AccordionContent>
              {craftItem.subgroups.map((group) => (
                <Accordion key={group.subtype} type="multiple">
                  <AccordionItem value="item-2">
                    <DialogTitle></DialogTitle>
                    <AccordionTrigger className="rounded-none border-b px-1 py-1.5 capitalize">
                      <div className="ml-2 flex items-center gap-2">
                        <img src={icons[group.subtype]} className="size-7" style={{ imageRendering: 'pixelated' }} />
                        <p className="">{group.subtype.toLocaleLowerCase()}</p>
                      </div>
                    </AccordionTrigger>

                    {group.items.map((craftItem) => (
                      <AccordionContent
                        key={craftItem.id}
                        onClick={() => onSelect(craftItem)}
                        className="hover:bg-secondary/30 p-1.5 hover:cursor-default"
                      >
                        <li className="text-muted-foreground sm:ml-4">{craftItem?.gameItem?.name}</li>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                </Accordion>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
      <CraftSelectResource resources={data?.resources} />
    </aside>
  );
});
