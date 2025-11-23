import { GameIcon } from '@/components/GameIcon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { imageConfig } from '@/lib/config';
import { capitalize, cn } from '@/lib/utils';
import { ApiGetCraftItemResponse, ArmorType, CraftItem, WeaponType } from '@/shared/types';
import { memo } from 'react';

import { CraftSelectResource } from './CraftSelectResource';



interface Props {
  data: ApiGetCraftItemResponse;
  onSelect: (item: CraftItem) => void;
  selectedItemId: string | undefined;
}

export const CraftSidebar = memo(({ data, onSelect, selectedItemId }: Props) => {
  return (
    <aside className="flex w-full max-w-[150px] flex-col border-r md:max-w-[200px]">
      <ScrollArea className="min-h-0">
        {data?.craftItems.map((craftItem) => (
          <Accordion key={craftItem.itemType} type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-secondary rounded-none p-3 capitalize">{capitalize(craftItem.itemType)}</AccordionTrigger>

              <AccordionContent>
                {craftItem.subgroups.map((group) => (
                  <Accordion key={group.subtype} type="multiple">
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="rounded-none px-1 py-1.5 capitalize text-neutral-500">
                        <div className="ml-2 flex items-center gap-2">
                          <GameIcon className='size-6' image={{ ...imageConfig.icon.ARMOR, ...imageConfig.icon.WEAPON }[group.subtype]} />
                          <span className="">{capitalize(group.subtype)}</span>
                        </div>
                      </AccordionTrigger>

                      {group.items.map((item) => (
                        <AccordionContent
                          key={item.id}
                          onClick={() => onSelect(item)}
                          className={cn('hover:bg-secondary/30 text-primary p-1.5 hover:cursor-default', {
                            'bg-yellow-500/20 hover:bg-yellow-500/20': selectedItemId === item.id,
                          })}
                        >
                          <li className="sm:ml-4">{item?.gameItem?.name}</li>
                        </AccordionContent>
                      ))}
                    </AccordionItem>
                  </Accordion>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </ScrollArea>
      <div className="mt-auto">
        <CraftSelectResource resources={data?.resources} />
      </div>
    </aside>
  );
});
