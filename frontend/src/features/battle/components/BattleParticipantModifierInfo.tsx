import { CustomTooltip } from '@/components/CustomTooltip';
import { GameIcon } from '@/components/GameIcon';
import { cn, getModifiers } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { Modifier } from '@/shared/types';

interface Props {
  modifier: Modifier;
}
export const BattleParticipantModifierInfo = ({ modifier }: Props) => {
  const modifiers = getModifiers(modifier);
  return (
    <CustomTooltip>
      <CustomTooltip.Trigger>
        <GameIcon className="size-4 opacity-85 hover:opacity-100" image={imageConfig.icon.ui.info} />
      </CustomTooltip.Trigger>
      <CustomTooltip.Content>
        <ul className="flex flex-col">
          {modifiers
            .sort((a, b) => a.sortNumber - b.sortNumber)
            .map((modifier) => {
              if (modifier.value === 0) return;
              return (
                <li key={modifier.name} className="flex items-center gap-2">
                  <p>{modifier.name}:</p>
                  <p className={cn('font-semibold', modifier.value > 0 ? 'text-green-500' : 'text-red-400')}>{modifier.value}</p>
                </li>
              );
            })}
        </ul>
      </CustomTooltip.Content>
    </CustomTooltip>
  );
};
