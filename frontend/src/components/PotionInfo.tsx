import { Potion } from '@/shared/types';

import { ModifierInfoCard } from './ModifierInfoCard';

type Props = Potion;

export const PotionInfo = ({ buffInfo, restore, type }: Props) => {
  if (!restore && !buffInfo) return;
  return (
    <section className="mt-1">
      {type === 'RESTORE' && (
        <div className="flex flex-col">
          {!!restore?.health && (
            <div className="flex gap-1">
              <span className="text-green-500"> +{restore.health}</span>
              <span className="text-muted-foreground">health</span>
            </div>
          )}

          {!!restore?.mana && (
            <div className="flex gap-1">
              <span className="text-green-500"> +{restore?.mana}</span>
              <span className="text-muted-foreground">mana</span>
            </div>
          )}
        </div>
      )}
      {type === 'BUFF' && <ModifierInfoCard modifier={buffInfo?.modifier} />}
    </section>
  );
};
