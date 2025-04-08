import { getUserQueryOptions, signIn } from '@/api/auth-api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/auth/sign-in')({
  component: SignIn,
  beforeLoad: ({ context }) => {
    if (context.auth) throw redirect({ to: '/auth/sign-up' });
  },
});
const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(3).max(255),
});
function SignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { password, username } = values;
    form.clearErrors('root');
    const res = await signIn({
      password,
      username,
    });
    if (!res.success) {
      form.setError('root', {
        message: res.message,
      });
    }
    if (res.success) {
      await queryClient.invalidateQueries({ queryKey: getUserQueryOptions().queryKey });
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Username</FormLabel>
              <FormControl>
                <Input className="placeholder:text-sm" {...field} />
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
                <Input className="placeholder:text-sm" {...field} />
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>}

        <Button disabled={isLoading} variant={'outline'} type="submit">
          Sign in ✨
        </Button>
        <div className="mx-auto flex items-center gap-1">
          <p className="text-muted-foreground"> Already have an account? </p>
          <Link className="text-blue-500 hover:underline" to={'/auth/sign-up'}>
            register
          </Link>
        </div>
      </form>
    </Form>
  );
}
