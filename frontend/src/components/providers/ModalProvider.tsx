import { ChangeColorBankTabModal } from '../modal/ChangeColorBankTabModal';
import { ChangeNameBankTabModal } from '../modal/ChangeNameBankTabModal';
import { DeleteItemInstanceModal } from '../modal/DeleteItemInstanceModal';

export const ModalProvider = () => {
  return (
    <>
      <ChangeNameBankTabModal />
      <ChangeColorBankTabModal />
      <DeleteItemInstanceModal />
    </>
  );
};
