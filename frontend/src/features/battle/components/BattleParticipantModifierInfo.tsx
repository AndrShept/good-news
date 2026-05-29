import { CustomTooltip } from '@/components/CustomTooltip';
import { GameIcon } from '@/components/GameIcon';
import { ModifierInfoCard } from '@/features/item-instance/components/ModifierInfoCard';
import { imageConfig } from '@/shared/config/image-config';
import { Modifier } from '@/shared/types';

interface Props {
  modifier: Modifier;
}
export const BattleParticipantModifierInfo = ({ modifier }: Props) => {
  return (
    <CustomTooltip>
      <CustomTooltip.Trigger>
        <GameIcon className='size-4' image={imageConfig.icon.ui.info} />
      </CustomTooltip.Trigger>
      <CustomTooltip.Content>
        <ModifierInfoCard modifiersArgs={[modifier]} />
      </CustomTooltip.Content>
    </CustomTooltip>
  );
};
