import { Background } from '@/components/Background';
import { HeroAvatarList } from '@/components/HeroAvatarList';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Stats } from '@/features/hero/components/Stats';
import { useCreateHero } from '@/features/hero/hooks/useCreateHero';
import { BASE_FREE_POINTS, BASE_STATS } from '@/shared/constants';
import { createHeroSchema } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/create-hero/')({
  component: RouteComponent,
});

const heroNameSchema = createHeroSchema.pick({
  name: true,
});

function RouteComponent() {
  const [avatarImage, setAvatarImage] = useState(`/sprites/avatar/Icon${1}.png`);
  const navigate = useNavigate();
  const [freePoints, setFreePoints] = useState(BASE_FREE_POINTS);
  const [stats, setStats] = useState(BASE_STATS);
  const mutation = useCreateHero();
  const form = useForm<z.infer<typeof heroNameSchema>>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(heroNameSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof heroNameSchema>) => {
    console.log(avatarImage)
    mutation.mutate(
      {
        avatarImage:avatarImage ,
        characterImage: '',
        name: values.name,
        freeStatPoints: freePoints,
        modifier: {
          constitution: stats.constitution,
          dexterity: stats.dexterity,
          intelligence: stats.intelligence,
          luck: stats.luck,
          strength: stats.strength,
        },
      },
      {
        onSuccess(data, variables, context) {
          if (!data.success && data.isShowError) {
            form.setError('name', { message: data.message });
          }
          if (data.success) {
            navigate({
              to: '/game',
            });
          }
        },
      },
    );
  };
  return (
    <Background imageUrl="/sprites/shrine6.png">
      <div className="m-auto flex max-w-5xl flex-col gap-4 rounded-lg border bg-black/70 p-4 text-[15px] backdrop-blur-md md:flex-row md:p-10">
        <div className="mx-auto">
          <HeroAvatarList avatar={avatarImage} setAvatar={setAvatarImage} />
        </div>

        <div className="mx-auto flex max-w-[220px] flex-col gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} className="bg-secondary" placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Stats
                freePoints={freePoints}
                setFreePoints={setFreePoints}
                setCurrentStats={setStats}
                currentStats={stats}
                reset={false}
                baseStats={BASE_STATS}

              />
              <Button className="w-full" type="submit" disabled={isLoading} variant={'default'}>
                {isLoading ? 'Creating... ' : 'Create Hero'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Background>
  );
}
