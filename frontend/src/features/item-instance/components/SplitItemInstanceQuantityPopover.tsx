import { AcceptButton } from '@/components/AcceptButton';
import { CancelButton } from '@/components/CancelButton';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftRightIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const createFormSchema = (maxQuantity: number) =>
  z.object({
    quantity: z.coerce.number().min(1).max(maxQuantity),
  });

type Props = {
  maxQuantity: number;
};
export const SplitItemInstanceQuantityPopover = ({ maxQuantity }: Props) => {
  const formSchema = createFormSchema(maxQuantity);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data);
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="w-10 opacity-70 hover:bg-transparent hover:opacity-100" variant="ghost">
          <ArrowLeftRightIcon className="size-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-secondary flex max-w-[160px] flex-col p-0 px-2 py-1">
        <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="quantity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
                <Input {...field} id={field.name} type="number" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="mt-2 flex justify-between">
            <div className="space-x-0.5">
              <Button type="button" onClick={() => form.setValue('quantity', 1)} className="size-7" variant={'outline'}>
                min
              </Button>
              <Button type="button" onClick={() => form.setValue('quantity', maxQuantity)} className="size-7" variant={'outline'}>
                max
              </Button>
            </div>
            <div>
              <AcceptButton type="submit" className="size-8" />
              <CancelButton type="reset" className="size-8" onClick={() => setIsOpen(false)} />
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
