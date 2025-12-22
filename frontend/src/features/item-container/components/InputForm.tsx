import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'name must be at least 2 characters.').max(32, 'name must be at most 15 characters.'),
});

interface Props {
  handleSubmit: (data: z.infer<typeof formSchema>) => void;
  children: ReactNode;
}

export const InputForm = ({ handleSubmit, children }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(formSchema),
  });

  const isPending = form.formState.isSubmitting;

  return (
    <form className="" onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            {/* <FieldLabel htmlFor={field.name}>Name</FieldLabel> */}
            <Input disabled={isPending} className="" {...field} id={field.name} aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {children}
    </form>
  );
};
