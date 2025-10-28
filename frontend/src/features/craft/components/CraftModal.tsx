import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { ArmorType, WeaponType } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { ReactElement } from 'react';

import { getCraftItemOptions } from '../api/get-craft-item';

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

export const CraftModal = () => {
  const { data: craftItems, isLoading } = useQuery(getCraftItemOptions());

  if (isLoading) return <p>...</p>;
  console.log(craftItems);
  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-fit">Craft</div>
      </DialogTrigger>
      <DialogContent className="h-[50%] overflow-hidden p-0 sm:max-w-2xl md:h-[70%] md:max-w-3xl">
        <DialogHeader>
          <section className="flex size-full">
            <aside className="flex w-full max-w-[200px] flex-col border-r">
              {craftItems?.map((craftItem) => (
                <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="bg-secondary rounded-none p-3 capitalize">
                      {craftItem.itemType.toLocaleLowerCase()}
                    </AccordionTrigger>
                    <AccordionContent>
                      {craftItem.subgroups.map((group) => (
                        <Accordion type="multiple">
                          <AccordionItem value="item-2">
                            <AccordionTrigger className="rounded-none border-b px-1 py-1.5 capitalize">
                              <div className="ml-2 flex items-center gap-2">
                                <img src={icons[group.subtype]} className="size-7" style={{ imageRendering: 'pixelated' }} />
                                <p className="">{group.subtype.toLocaleLowerCase()}</p>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="hover:bg-secondary/30 p-1.5 hover:cursor-default">
                              {group.items.map((item) => (
                                <li className="text-muted-foreground sm:ml-4">{item?.gameItem?.name}</li>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </aside>
            <div className="flex min-w-[200px] flex-1 flex-col">
              <div className="flex-1">asds</div>
              <div className="bg-secondary h-40">asds</div>
            </div>
          </section>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
