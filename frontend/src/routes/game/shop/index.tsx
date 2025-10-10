import { GameItemCardShowInfo } from '@/components/GameItemCardShowInfo';
import { getShopItemsOptions } from '@/features/shop/api/get-shop-items';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/shop/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: shopItems, isLoading } = useQuery(getShopItemsOptions());
  // if (isLoading) return <div>loading</div>;
  console.log('asdasdsa', shopItems)
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {shopItems?.data?.map((item) => <GameItemCardShowInfo key={item.id} {...item} isShowBuyButton isShowPrice />)}
    </ul>
  );
}
