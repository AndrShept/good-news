import { GameIcon } from '@/components/GameIcon';
import { getTimeFns } from '@/lib/utils';
import { SkipRoundLog } from '@/shared/battle-types';
import { imageConfig } from '@/shared/config/image-config';

interface Props {
  log: SkipRoundLog;
}
export const SkipRoundLogCard = ({ log }: Props) => {
  return (
    <li className='inline-flex items-center gap-1 '>
      <span className="text-zinc-600">[{getTimeFns(log.createdAt)}] </span>
      <GameIcon className='size-5' image={imageConfig.icon.ui.clock} />
      <span className="text-olive-300">{log.participantName}</span> <span className="text-olive-500">{log.message}</span>
    </li>
  );
};
