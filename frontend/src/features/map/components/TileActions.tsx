import { EnterTownButton } from './EnterTownButton';

type Props = {
  isTown: boolean;
  tileId: string;
};

export const TileActions = ({ isTown, tileId }: Props) => {
  return (
    <section className="mt-auto flex flex-wrap">
      <EnterTownButton isTown={isTown} tileId={tileId} />
    </section>
  );
};
