import { CustomTooltip } from '@/components/CustomTooltip';
import { Buff } from '@/shared/types';

interface Props {
  buff: Buff;
}

export const BuffCard = ({ buff }: Props) => {
  return (
    <article>
      <CustomTooltip>
        <CustomTooltip.Trigger>
          <img  src={buff.image} alt={buff.name} className=' rounded-md size-8 opacity-90 hover:opacity-100' />
        </CustomTooltip.Trigger>
        <CustomTooltip.Content >{buff.expired}</CustomTooltip.Content>
      </CustomTooltip>
    </article>
  );
};
