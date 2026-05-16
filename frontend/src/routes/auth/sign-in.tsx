import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/features/auth/api/sign-in';
import { loginSchema } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { LockIcon, UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/auth/sign-in')({
  component: SignIn,
  beforeLoad: ({ context }) => {
    if (context.auth) throw redirect({ to: '/' });
  },
});

export function SignIn() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { password, email } = values;
    form.clearErrors('root');
    const res = await signIn({
      password,
      email,
    });
    if (!res.success) {
      form.setError('root', {
        message: res.message,
      });
    }
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-xs flex-col gap-2.5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <UserIcon className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
                  <Input placeholder="email" disabled={isLoading} className="pl-7.5 placeholder:text-sm" {...field} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <LockIcon className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
                  <Input placeholder="password" disabled={isLoading} className="pl-7.5 placeholder:text-sm" {...field} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>}

        <Button className="mt-4" disabled={isLoading} variant={'default'} type="submit">
          Login ✨
        </Button>
        <div className="mx-auto flex items-center gap-1">
          <p className="text-sm"> Already have an account? </p>
          <Link disabled={isLoading} className="text-primary hover:underline" to={'/auth/sign-up'}>
            register
          </Link>
        </div>
      </form>
    </Form>
  );
}
