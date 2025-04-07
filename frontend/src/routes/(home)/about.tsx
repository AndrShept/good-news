import { SortByFilter } from '@/components/SortByFilter';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { SearchSchema } from '.';

export const Route = createFileRoute('/(home)/about')({
  component: About,
  validateSearch: zodValidator(SearchSchema),
});

function About() {
  const { sortBy, order } = Route.useSearch();
  return (
    <div>
      Hello "/about"!
      zxczxcsdfdsfgd
      <SortByFilter order={order} sortBy={sortBy} />
    </div>
  );
}
