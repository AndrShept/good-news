import { InputForm } from '@/features/item-container/components/InputForm';
import { useBankItemContainerChangeNameMutation } from '@/features/item-container/hooks/useBankItemContainerChangeNameMutation';
import { useModalStore } from '@/store/useModalStore';

import { AcceptButton } from '../AcceptButton';
import { CancelButton } from '../CancelButton';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

export const ChangeNameBankTabModal = () => {
  const { modalData, setModalData } = useModalStore();
  const isOpen = modalData?.type === 'BANK_CHANGE_NAME';
  const { mutateAsync, isPending } = useBankItemContainerChangeNameMutation();
  const handleSubmit = async (data: { name: string }) => {
    await mutateAsync({ itemContainerId: modalData?.id ?? '', name: data.name });
    setModalData(null);
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => setModalData(null)}>
      <DialogContent className="rounded sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rename Bank Container</DialogTitle>
          <DialogDescription>Enter a new name for this bank container. You can change the name at any time.</DialogDescription>
        </DialogHeader>
        <InputForm handleSubmit={handleSubmit}>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <CancelButton disabled={isPending} />
            </DialogClose>
            <AcceptButton disabled={isPending} />
          </DialogFooter>
        </InputForm>
      </DialogContent>
    </Dialog>
  );
};
