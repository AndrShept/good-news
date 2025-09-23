import { useHero } from '@/features/hero/hooks/useHero';
import { useWalkOnMap } from '@/features/hero/hooks/useWalkOnMap';
import { IPosition } from '@/shared/types';

interface Props {
  tilePosition: IPosition;
}

export const MovableTile = ({ tilePosition }: Props) => {
  const { mutate, isPending } = useWalkOnMap();
  const onMove = () => {
    mutate(tilePosition);
  };
  return (
    <>
      <button
        disabled={isPending}
        onClick={onMove}
        className="z-4 absolute left-0 top-0 size-full bg-black/40 hover:cursor-pointer hover:bg-black/60"
      />
    </>
  );
};
