import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useModalStore } from '@/store/useModalStore';
import { EllipsisVerticalIcon } from 'lucide-react';

type Props = {
  id: string;
};
export const BankItemContainerTabMenu = ({ id }: Props) => {
  const setModalData = useModalStore((state) => state.setModalData);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon className="size-5.5 opacity-0 mx-1  group-hover:opacity-100" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setModalData({ id, type: 'BANK_CHANGE_NAME' })}>Change name</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setModalData({ id, type: 'BANK_CHANGE_COLOR' })}>Color picker</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
