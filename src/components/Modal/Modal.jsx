import React from 'react';
import ReactDOM from 'react-dom';

import { StyledModal } from './StyledModal';

const Modal = ({ title, closeModal, children, modal }) => {
  const hideModal = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return ReactDOM.createPortal(
    <StyledModal className={modal ? 'modal-open' : ''} onClick={hideModal}>
      <div className="content">
        {title && <p className="heading">{title}</p>}        
        <span className="close-icon" onClick={closeModal} title="close">
          &times;
        </span>
        <div>{children}</div>
      </div>
    </StyledModal>,
    document.querySelector('#modal-root'),
  );
};

export default Modal;
