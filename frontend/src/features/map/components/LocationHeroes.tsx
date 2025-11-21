import { HeroAvatar } from '@/components/HeroAvatar';
import { Location } from '@/shared/types';
import { memo } from 'react';

interface Props {
  locationHeroes: Location[] | undefined;
}

export const LocationHeroes = memo(({ locationHeroes }: Props) => {
  return (
    <ul className="hidden w-full max-w-[200px] flex-col gap-1 md:flex">
      {locationHeroes?.map((location) => (
        <li key={location.id} className="hover:bg-secondary flex items-center gap-1.5 rounded px-2 py-1 duration-75">
          <HeroAvatar size={'sm'} src={location.hero?.avatarImage ?? ''} />
          <div className="text-sm">
            <p className="line-clamp-1 font-semibold">{location.hero?.name}</p>
            <p className="text-muted-foreground">level: {location.hero?.level}</p>
          </div>
        </li>
      ))}
    </ul>
  );
});
