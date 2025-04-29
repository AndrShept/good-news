import { Background } from '@/components/Background';
import { HeroAvatarList } from '@/components/HeroAvatarList';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createHero } from '@/features/hero/api/create-hero';
import { createHeroSchema } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export const Route = createFileRoute('/create-hero/')({
  component: RouteComponent,
});

const heroNameSchema = createHeroSchema.pick({
  name: true,
});

function RouteComponent() {
  const [image, setImage] = useState('');

  const form = useForm<z.infer<typeof heroNameSchema>>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(heroNameSchema),
  });
  const isLoading = form.formState.isSubmitting;
  const { mutate } = useMutation({
    mutationFn: createHero,
    onSuccess(data, variables, context) {
      if (!data.success && data.isShowError) {
        form.setError('name', { message: data.message });
      }
      if (data.success) {
        console.log(data.data);
      }
    },
    onError(error, variables, context) {
      console.log('onError -', error.cause);
      console.log('onError -', error.message);
      toast.error('Something went wrong')

    },
  });
  const onSubmit = (values: z.infer<typeof heroNameSchema>) => {
    const res = mutate({ image, name: values.name });
  };
  return (
    <Background imageUrl="/sprites/shrine6.png">
      <div className="m-auto flex max-w-5xl flex-col gap-4 rounded-lg border bg-black/70 p-4 text-[15px] backdrop-blur-md md:flex-row md:p-10">
        <div className="mx-auto">
          <HeroAvatarList avatar={image} setAvatar={setImage} />
        </div>

        <div className="mx-auto flex max-w-[220px] flex-col gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} className="bg-secondary" placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading} variant={'secondary'} onClick={() => {}}>
                {isLoading ? 'Creating... ' : 'Create Hero'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Background>
  );
}
