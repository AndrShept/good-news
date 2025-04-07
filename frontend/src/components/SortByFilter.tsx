import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order, SortBy, sortBySchema } from '@/shared/types';
import { useNavigate } from '@tanstack/react-router';
import { AlarmClockIcon, ArrowDownAZIcon, ArrowDownZaIcon, HeartIcon } from 'lucide-react';

interface Props {
  order: string;
  sortBy: string;
}

export const SortByFilter = ({ order, sortBy }: Props) => {
  const navigate = useNavigate();
  const sortByVariant = sortBySchema.Values;
  return (
    <div className="flex gap-2">
      <Select
        defaultValue={order}
        onValueChange={(order: Order) => {
          navigate({
            to: '.',
            search: (prev) => ({ ...prev, order }),
          });
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder={order} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'asc'}>
            ASC <ArrowDownAZIcon />
          </SelectItem>
          <SelectItem value="desc">
            DESC <ArrowDownZaIcon />
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={sortBy}
        onValueChange={(sortBy: SortBy) => {
          navigate({
            to: '.',
            search: (prev) => ({ ...prev, sortBy }),
          });
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder={sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={sortByVariant.points}>
            {sortByVariant.points.toLocaleUpperCase()} <HeartIcon />
          </SelectItem>
          <SelectItem value={sortByVariant.recent}>
            {sortByVariant.recent.toLocaleUpperCase()} <AlarmClockIcon />
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
