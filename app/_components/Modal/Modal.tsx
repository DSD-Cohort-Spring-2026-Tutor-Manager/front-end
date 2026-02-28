import React, { useContext } from 'react';
import './Modal.css';
import { ModalContext } from './ModalContext';

type ModalType = 'confirm' | 'add student' | 'book session';

export interface ModalButton {
  text: string;
  className?: string;
  onClick: () => any;
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

  if (type === 'add student') {
    return (
      <div className='modal add-student-modal'>
      <div className='modal-content add-student-modal-content'>
        <h2 className='add-student-modal_header'>
          Add Student
        </h2>
        <p className='add-student-modal-text'>
          Fill in your student's name below.
        </p>
        <div className='add-student-modal-input__container mt-2'>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            First name
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName" type="text" placeholder=""></input>
        </div>

        <div className='add-student-modal-input__container'>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Last name
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastName" type="text" placeholder=""></input>
        </div>
        
        <div className='add-student-modal-buttons'>
          {buttons.map((button, index) =>
            <button
              key={`modal-button-${index}`}
              className={`modal-button ${button.className}`}
              onClick={() => button.onClick()}
            >
              {button.text}
            </button>
          )}
        </div>
      </div>
    </div>
    );
  }

  if (type === 'book session') {
    return (
      <div className='modal'>
      <div className='modal-content'>
        <p className='modal-text'>{text}</p>
        <div id='modal__buttons-container'>
          {buttons?.map((button, index) => (
            <button
              key={`modal-button-${index}`}
              className={`modal-button ${button.className}`}
              onClick={() => button.onClick()}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
    );
  }

  return (
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
  );
};

export default Modal;
