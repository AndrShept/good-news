import { getTimeFns } from '@/lib/utils';
import { SkipRoundLog } from '@/shared/battle-types';

interface Props {
  log: SkipRoundLog;
}
export const SkipRoundLogCard = ({ log }: Props) => {
  return (
    <li>
      <span className="text-zinc-600">[{getTimeFns(Date.now())}] </span>
      <span className="text-olive-300">{log.participantName}</span> <span className="text-olive-500">{log.message}</span>
    </li>
  );
};
