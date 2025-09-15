import { useHero } from '@/features/hero/hooks/useHero';
import { useWalkOnMap } from '@/features/hero/hooks/useWalkOnMap';

interface Props {
  tileId: string;
}

export const MovableTile = ({ tileId }: Props) => {
  const { mutate, isPending } = useWalkOnMap();
  const onMove = () => {
    mutate(tileId);
  };
  return (
    <>
      <button disabled={isPending} onClick={onMove} className="z-4 absolute left-0 top-0 size-full bg-black/50 hover:cursor-pointer" />
    </>
  );
};
