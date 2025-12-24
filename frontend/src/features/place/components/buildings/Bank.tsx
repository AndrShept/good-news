import { Spinner } from '@/components/Spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getBankItemContainersOptions } from '@/features/item-container/api/get-bank-item-containers';
import { BankItemContainer } from '@/features/item-container/components/BankItemContainer';
import { BankItemContainerTabMenu } from '@/features/item-container/components/BankItemContainerTabMenu';
import { CreateBankItemContainerModal } from '@/features/item-container/components/CreateBankItemContainerModal';
import { capitalize, cn } from '@/lib/utils';
import { Place } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type Props = {
  place: Place | undefined | null;
};

export const Bank = ({ place }: Props) => {
  const heroId = useHeroId();
  const { data: itemContainers, isLoading } = useQuery(getBankItemContainersOptions(heroId));
  const [select, setSelect] = useState('');

  useEffect(() => {
    setSelect(select ? select : (itemContainers?.[0].id ?? ''));
  }, [itemContainers, select]);
  if (isLoading) return <Spinner size={'sm'} />;
  return (
    <section className="mx-auto flex w-full max-w-[600px] flex-col">
      <h2 className="mb-2 text-center text-xl text-blue-400">{capitalize(place?.name)} bank</h2>

      <Tabs value={select} onValueChange={setSelect} defaultValue={itemContainers?.[0]?.id}>
        <ScrollArea className="w-full pb-2">
          <TabsList className="bg-background h-fit gap-0.5">
            {itemContainers?.map((container) => (
              <div key={container.id} className="group flex h-9 min-w-14 items-center">
                <TabsTrigger
                  className={cn('rounded-none', {
                    'ring-1': container.id === select,
                  })}
                  style={{ backgroundColor: container.color ?? undefined }}
                  value={container.id}
                >
                  {container.name}
                </TabsTrigger>
                  <BankItemContainerTabMenu id={container.id} />
              </div>
            ))}
            <CreateBankItemContainerModal placeName={place?.name ?? ''} />
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {itemContainers?.map((container) => (
          <TabsContent key={container.id} value={container.id}>
            <BankItemContainer containerId={container.id} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};
