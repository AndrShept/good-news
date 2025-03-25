import { createPost, getPostsQueryOptions } from '@/api/post-api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createPostSchema } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const PostCreateFrom = () => {
  const queryClient = useQueryClient();
  const queryKey = getPostsQueryOptions().queryKey;
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey });
    },
  });
  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      title: '',
      url: '',
    },
  });

  function onSubmit(values: z.infer<typeof createPostSchema>) {
    createPostMutation.mutate({
      ...values,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={createPostMutation.isPending} type="submit">
          Create
        </Button>
      </form>
    </Form>
  );
};
