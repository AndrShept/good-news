import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order, SortBy, sortBySchema } from '@/shared/types';
import { useNavigate } from '@tanstack/react-router';

interface Props {
  order: string;
  sortBy: string;
  sortByVariant: typeof sortBySchema.Values;
}

export const SortByFilter = ({ order, sortBy, sortByVariant }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Select
        defaultValue={order}
        onValueChange={(order: Order) => {
          navigate({
            to: '/',
            search: (prev) => ({ ...prev, order }),
          });
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder={order} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'asc'}>asc</SelectItem>
          <SelectItem value="desc">desc</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={sortBy}
        onValueChange={(sortBy: SortBy) => {
          navigate({
            to: '/',
            search: (prev) => ({ ...prev, sortBy }),
          });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={sortByVariant.points}>{sortByVariant.points}</SelectItem>
          <SelectItem value={sortByVariant.recent}>{sortByVariant.recent}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
