import { Spinner } from '@/components/Spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getBankItemContainersOptions } from '@/features/item-container/api/get-bank-item-containers';
import { BankItemContainer } from '@/features/item-container/components/BankItemContainer';
import { BankItemContainerTabMenu } from '@/features/item-container/components/BankItemContainerTabMenu';
import { CreateBankItemContainerModal } from '@/features/item-container/components/CreateBankItemContainerModal';
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
    <section className="mx-auto flex w-full max-w-[600px] flex-col">
      <h2 className="mb-2 text-center text-xl text-blue-400">{capitalize(place?.name)} bank</h2>

      <Tabs defaultValue={itemContainers?.[0]?.id}>
        <div className="flex w-full items-center">
          <ScrollArea className="w-full pb-2">
            <TabsList className="bg-background h-10 gap-0.5">
              {itemContainers?.map((container) => (
                <div key={container.id} className="group flex h-10 items-center">
                  <TabsTrigger className="rounded" style={{ backgroundColor: container.color ?? undefined }} value={container.id}>
                    {container.name}
                  </TabsTrigger>
                  <div className="opacity-0 group-hover:opacity-100">
                    <BankItemContainerTabMenu id={container.id} />
                  </div>
                </div>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <CreateBankItemContainerModal placeName={place?.name ?? ''} />
        </div>

        {itemContainers?.map((container) => (
          <TabsContent key={container.id} value={container.id}>
            <BankItemContainer containerId={container.id} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};
