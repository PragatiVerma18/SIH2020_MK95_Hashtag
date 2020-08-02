import { useState } from 'react';

export const useModal = (initialMode = false) => {
  const [modal, setModal] = useState(initialMode);

  const showModal = () => {
    setModal(true);
    document.body.style.overflow = 'hidden';
  };
  const hideModal = () => {
    setModal(false);
    document.body.style.overflow = 'auto';
  };

  return [modal, showModal, hideModal];
};
