import { Spinner } from '@/components/Spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getBankItemContainersOptions } from '@/features/item-container/api/get-bank-item-containers';
import { BankItemContainer } from '@/features/item-container/components/BankItemContainer';
import { CreateBankItemContainer } from '@/features/item-container/components/CreateBankItemContainer';
import { capitalize } from '@/lib/utils';
import { Place } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

type Props = {
  place: Place | undefined | null;
};

export const Bank = ({ place }: Props) => {
  const heroId = useHeroId();
  const { data: itemContainers, isLoading } = useQuery(getBankItemContainersOptions(heroId));
  if (isLoading) return <Spinner size={'sm'} />;
  return (
    <section className="mx-auto flex w-full max-w-[600px] flex-col gap-0.5">
      <h2 className="text-center text-xl text-yellow-300">{capitalize(place?.name)} bank</h2>

      <Tabs className="" defaultValue={itemContainers?.[0]?.id}>
        <ScrollArea className="w-full pb-2">
          <TabsList className="bg-background h-10">
            {itemContainers?.map((container) => (
              <TabsTrigger key={container.id} value={container.id} className="flex-none whitespace-nowrap">
                {container.name}
                asdsad
              </TabsTrigger>
            ))}
            <CreateBankItemContainer placeName={place?.name ?? ''} />
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
