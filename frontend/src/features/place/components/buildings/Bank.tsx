import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHero } from '@/features/hero/hooks/useHero';
import { BankItemContainer } from '@/features/item-container/components/BankItemContainer';
import { CreateBankItemContainer } from '@/features/item-container/components/CreateBankItemContainer';

export const Bank = () => {
  const itemContainers = useHero((state) => state?.data?.itemContainers?.filter((c) => c.type === 'BANK'));
  return (
    <div>
      <Tabs defaultValue={itemContainers?.[0].id} className="w-[400px]">
        <div className="flex gap-1">
          <TabsList>
            {itemContainers?.map((container) => (
              <TabsTrigger key={container.id} value={container.id}>
                {container.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <CreateBankItemContainer />
        </div>

        <ul>
          {itemContainers?.map((container) => (
            <TabsContent key={container.id} value={container.id}>
              <BankItemContainer containerId={container.id} />
            </TabsContent>
          ))}
        </ul>
      </Tabs>
    </div>
  );
};
