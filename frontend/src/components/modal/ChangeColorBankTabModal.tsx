import { useBankItemContainerChangeMutation } from '@/features/item-container/hooks/useBankItemContainerChangeMutation';
import { useModalStore } from '@/store/useModalStore';
import { ColorPicker, useColor } from 'react-color-palette';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import 'react-color-palette/css';

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

export const ChangeColorBankTabModal = () => {
  const { modalData, setModalData } = useModalStore();
  const { mutateAsync, isPending } = useBankItemContainerChangeMutation();
  const isOpen = modalData?.type === 'BANK_CHANGE_COLOR';
  const [color, setColor] = useColor('#561ecb');
  const handleSubmit = async () => {
    await mutateAsync({ itemContainerId: modalData?.id ?? '', data: { color: color.hex } });
    setModalData(null);
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => setModalData(null)}>
      <DialogOverlay className="bg-black/30" />
      <DialogContent className="rounded sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Color Bank Container</DialogTitle>
          <DialogDescription>Change a color for this bank container. You can change the color at any time.</DialogDescription>
          <ColorPicker hideInput={['rgb', 'hsv']} color={color} onChange={setColor} />
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <CancelButton disabled={isPending} />
          </DialogClose>
          <AcceptButton disabled={isPending} onClick={handleSubmit} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
