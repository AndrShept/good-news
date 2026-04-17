import { GameAvatar } from '@/components/GameAvatar';

interface Props {
  image: string;
  name: string;
}

export const ShopAvatar = ({ image, name }: Props) => {
  return (
    <div className="flex items-center gap-1 capitalize">
      <GameAvatar src={image} />
      <p className="text-muted-foreground">{name}</p>
    </div>
  );
};
