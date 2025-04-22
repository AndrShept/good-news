import { createAccount, getUserQueryOptions } from '@/api/auth-api';
import { createFileRoute, redirect } from '@tanstack/react-router';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/auth/confirm-email')({
  component: RouteComponent,
  validateSearch: (data: { email: string; token?: string }) => data,
  beforeLoad: async ({ search: { token }, context }) => {
    if (token) {
      const res = await createAccount(token);
      if (res?.success) {
        await context.queryClient.invalidateQueries({
          queryKey: getUserQueryOptions().queryKey,
        });
        toast.success(res?.message);
        throw redirect({ to: '/' });
      }
      throw redirect({ to: '/auth' });
    }
  },
});

function RouteComponent() {
  const { email } = Route.useSearch();

  return (
    <div className="bg-secondary max-w-4xs scroll-m-20 rounded px-6 py-10 text-xl font-semibold tracking-tight">
      <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Thank you for registering.</h1>
      <p className="text-muted-foreground"> An account verification email has been sent to your email - </p>
      <p className="font-bold text-green-500">{email}</p>
    </div>
  );
}
