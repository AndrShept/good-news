import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/features/auth/api/sign-in';
import { loginSchema } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/auth/sign-in')({
  component: SignIn,
  beforeLoad: ({ context }) => {
    if (context.auth) throw redirect({ to: '/' });
  },
});

function SignIn() {
  const navigate = useNavigate();
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
      navigate({ to: '/' });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[320px] flex-col gap-4 md:w-[380px]">
        <h1 className="text-primary scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight">Sign In</h1>
        <p className="mb-4"> Enter your details to login an account</p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Email</FormLabel>
              <FormControl>
                <Input disabled={isLoading} className="placeholder:text-sm" {...field} />
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Password</FormLabel>
              <FormControl>
                <Input disabled={isLoading} type="password" className="placeholder:text-sm" {...field} />
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>}

        <Button disabled={isLoading} variant={'default'} type="submit">
          Sign in ✨
        </Button>
        <div className="mx-auto flex items-center gap-1">
          <p className="text-muted-foreground"> Already have an account? </p>
          <Link disabled={isLoading} className="text-blue-500 hover:underline" to={'/auth/sign-up'}>
            register
          </Link>
        </div>
      </form>
    </Form>
  );
}
