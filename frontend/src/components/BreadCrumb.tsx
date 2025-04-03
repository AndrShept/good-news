import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, useLocation } from '@tanstack/react-router';

export const BreadCrumb = () => {
  const { pathname } = useLocation();

  const arr = pathname.split('/');

  return (
    <Breadcrumb className="mb-2 border-b pb-2">
      <ul className="flex items-center">
        {arr.map((item, idx) => (
          <BreadcrumbList key={idx} className="hover:text-primary hover:underline sm:gap-1">
            <BreadcrumbItem className="capitalize">
              <Link to={'/'}>{item ? `${item}` : 'home'}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        ))}
      </ul>
    </Breadcrumb>
  );
};
