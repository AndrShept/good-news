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
import { Plus } from 'lucide-react';

export const CreateBankItemContainer = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          {/* <Plus /> */}
          <GameIcon image={imageConfig.icon.ui.prem} />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Purchase Additional Bank Slot? This will unlock a new permanent storage slot in your Bank Box.
          </DialogDescription>
          <div className="mx-auto flex gap-1 text-yellow-400">
            <span className="text-center">This will cost 100</span>
            <GameIcon image={imageConfig.icon.ui.prem} />
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <CancelButton />
          </DialogClose>
          <AcceptButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
