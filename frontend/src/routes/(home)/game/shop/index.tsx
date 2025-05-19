import { GameItemCard } from '@/components/GameItemCard';
import { getShopItemsOptions } from '@/features/shop/api/get-shop-items';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)/game/shop/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: shopItems } = useSuspenseQuery(getShopItemsOptions());
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {shopItems?.data?.map((item) => <GameItemCard gameItem={item} />)}
    </ul>
  );
}
