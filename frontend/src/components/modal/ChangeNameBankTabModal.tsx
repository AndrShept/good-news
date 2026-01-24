import { InputForm } from '@/features/item-container/components/InputForm';
import { useBankItemContainerChangeMutation } from '@/features/item-container/hooks/useBankItemContainerChangeMutation';
import { useModalStore } from '@/store/useModalStore';

import { AcceptButton } from '../AcceptButton';
import { CancelButton } from '../CancelButton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '../ui/dialog';

export const ChangeNameBankTabModal = () => {
  const { modalData, setModalData } = useModalStore();
  const isOpen = modalData?.type === 'BANK_CHANGE_NAME';
  const { mutateAsync, isPending } = useBankItemContainerChangeMutation();
  const handleSubmit = async (data: { name: string }) => {
    await mutateAsync({ itemContainerId: modalData?.id ?? '', data });
    setModalData(null);
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => setModalData(null)}>
      <DialogOverlay className="bg-black/30" />
      <DialogContent className="rounded sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rename Bank Container</DialogTitle>
          <DialogDescription>Enter a new name for this bank container. You can change the name at any time.</DialogDescription>
        </DialogHeader>
        <InputForm handleSubmit={handleSubmit}>
          <DialogFooter className="mt-2">

            <AcceptButton disabled={isPending} />
            <DialogClose asChild>
              <CancelButton disabled={isPending} />
            </DialogClose>
          </DialogFooter>
        </InputForm>
      </DialogContent>
    </Dialog>
  );
};
