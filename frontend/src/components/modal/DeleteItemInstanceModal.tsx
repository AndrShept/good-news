import { useDeleteContainerItem } from '@/features/item-instance/hooks/useDeleteContainerItem';
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

export const DeleteItemInstanceModal = () => {
  const { modalData, setModalData } = useModalStore();
  const { mutateAsync, isPending } = useDeleteContainerItem();
  const isOpen = modalData?.type === 'DELETE_ITEM_INSTANCE';
  const handleSubmit = async () => {
    if (!modalData || !modalData.itemInstance) return;
    await mutateAsync({ itemContainerId: modalData.itemInstance.itemContainerId!, itemInstanceId: modalData.id });
    setModalData(null);
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => setModalData(null)}>
      <DialogOverlay className="" />
      <DialogContent className="rounded sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-red-300">Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone. The item will be permanently deleted.</DialogDescription>
        </DialogHeader>
        <div className="mx-auto">
          {modalData && modalData.itemInstance && (
            <p className="font-semibold">
              {modalData.itemInstance.itemTemplate.name}
              {modalData.itemInstance.quantity > 1 && (
                <span className="font-normal text-yellow-300"> x{modalData.itemInstance.quantity}</span>
              )}
            </p>
          )}
        </div>
        <DialogFooter>

          <AcceptButton disabled={isPending} onClick={handleSubmit} />
          <DialogClose asChild>
            <CancelButton disabled={isPending} />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
