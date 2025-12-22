import { AcceptButton } from '@/components/AcceptButton';
import { CancelButton } from '@/components/CancelButton';
import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { imageConfig } from '@/shared/config/image-config';
import { BANK_CONTAINER_COST } from '@/shared/constants';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { useCreateBankItemContainerMutation } from '../hooks/useCreateBankItemContainerMutation';

type Props = {
  placeName: string;
};
export const CreateBankItemContainerModal = ({ placeName }: Props) => {
  const { mutateAsync, isPending } = useCreateBankItemContainerMutation();
  const [isShow, setIsShow] = useState(false);

  const onClick = async () => {
    await mutateAsync();
    setIsShow(false);
  };
  return (
    <Dialog open={isShow} onOpenChange={setIsShow}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <GameIcon image={imageConfig.icon.ui.prem} />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently unlock a new storage slot in your Bank Box in <span className="text-blue-400">{placeName}</span>
          </DialogDescription>
          <div className="mx-auto flex gap-1">
            <span className="text-center text-red-400">This will cost </span>
            <span className="text-center">{BANK_CONTAINER_COST} </span>
            <GameIcon image={imageConfig.icon.ui.prem} />
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <CancelButton disabled={isPending} />
          </DialogClose>
          <AcceptButton disabled={isPending} onClick={onClick} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
