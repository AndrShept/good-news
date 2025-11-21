import { getShopItemsOptions } from '@/features/shop/api/get-shop-items';
import { useQuery } from '@tanstack/react-query';

import { GameItemCardShowInfo } from '../../../../components/GameItemCardShowInfo';

export const MagicShop = () => {
  const { data: shopItems, isLoading } = useQuery(getShopItemsOptions());
  if (isLoading) return <p>Shop Loading...</p>;
  return (
    <section className="flex flex-col items-center gap-2">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {shopItems?.data?.map((item) => <GameItemCardShowInfo key={item.id} {...item} isShowBuyButton isShowPrice />)}
      </ul>
    </section>
  );
};
