import { useGameData } from '@/features/hero/hooks/useGameData';
import { PotionInfo as TPotionInfo } from '@/shared/types';

import { ModifierInfoCard } from './ModifierInfoCard';

interface Props {
  potionInfo: TPotionInfo;
}
export const PotionInfo = ({ potionInfo }: Props) => {
  const { buffTemplateById } = useGameData();

  return (
    <>
      <div className="mb-1">
        <span>type: </span>
        <span>{potionInfo.type.toLowerCase()}</span>
      </div>

      {potionInfo.restore?.health && (
        <div>
          health: <span className="text-green-500">+{potionInfo.restore?.health}</span>
        </div>
      )}
      {potionInfo.restore?.mana && (
        <div>
          mana: <span className="text-green-500">+{potionInfo.restore?.mana}</span>
        </div>
      )}

      {potionInfo.buffTemplateId && <ModifierInfoCard modifiersArgs={[buffTemplateById[potionInfo.buffTemplateId].modifier]} />}
    </>
  );
};
