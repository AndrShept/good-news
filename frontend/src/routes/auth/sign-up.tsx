import { Spinner } from '@/components/Spinner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUp } from '@/features/auth/api/sign-up';
import { loginSchema, registerSchema } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    form.clearErrors('root');
    const res = await signUp(values);
    if (!res.success) {
      form.setError('root', {
        message: res.message,
      });
    }
    if (res.success) {
      navigate({ to: '/auth/confirm-email', search: { email: values.email } });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[320px] flex-col gap-4 md:w-[380px]">
        <h1 className="text-primary scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight">Sign Up</h1>
        <p className="mb-4"> Enter your details to create an account</p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Email*</FormLabel>
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Username*</FormLabel>
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
              <FormLabel className="text-primary">Password*</FormLabel>
              <FormControl>
                <Input disabled={isLoading} type="password" className="placeholder:text-sm" {...field} />
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Confirm password*</FormLabel>
              <FormControl>
                <Input disabled={isLoading} type="password" className="placeholder:text-sm" {...field} />
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>}
        <Button className="mt-4" disabled={isLoading} variant={'default'} type="submit">
          Sign Up 🔥
          <p>{isLoading && <Spinner className="ml-1" size={'sm'} />}</p>
        </Button>
        <div className="mx-auto flex items-center gap-1">
          <p className="text-muted-foreground"> Already have an account? </p>
          <Link disabled={isLoading} className="text-blue-500 hover:underline" to={'/auth/sign-in'}>
            login
          </Link>
        </div>
      </form>
    </Form>
  );
}
