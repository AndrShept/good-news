import React from 'react';

import { ChangeColorBankTabModal } from '../modal/ChangeColorBankTabModal';
import { ChangeNameBankTabModal } from '../modal/ChangeNameBankTabModal';

export const ModalProvider = () => {
  return (
    <>
      <ChangeNameBankTabModal />
      <ChangeColorBankTabModal />
    </>
  );
};
