import React, { useContext } from 'react';
import './Modal.css';
import { ModalContext } from './ModalContext';

type ModalType = 'confirm';

interface ModalButton {
  text: string;
  onClick: () => void;
}

const Modal = ({
  type,
  text,
  buttons,
}: {
  type?: ModalType | undefined;
  text: string;
  buttons: ModalButton[];
}) => {
  const { isOpen, setIsOpen } = useContext(ModalContext);
  return (
    // isOpen ?
    <div className='modal'>
      <div className='modal-content'>
        <p className='modal-text'>{text}</p>
        <div id='modal__buttons-container'>
          {buttons?.map((button, index) => (
            <button
              key={`modal-button-${index}`}
              className='modal-button'
              onClick={() => button.onClick()}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
    // :
    // undefined
  );
};

export default Modal;
