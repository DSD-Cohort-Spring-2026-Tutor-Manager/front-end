import React, { useContext } from 'react';
import './Modal.css';
import { ModalContext } from './ModalContext';

type ModalType = 'confirm' | 'add student' | 'book session';

export interface ModalButton {
  text: string;
  className?: string;
  onClick: () => any;
}

export interface SessionData {
  tutorName: string;
  date: string;
  subject: string;
}

const Modal = ({
  type,
  text,
  buttons,
  sessionData
}: {
  type?: ModalType | undefined;
  text?: string | undefined;
  buttons: ModalButton[];
  sessionData?: SessionData
}) => {
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
  } else if (type === 'book session') {
    return (
      <div className='modal'>
        <div className='modal-content book-session-modal-content w-1/2'>
          <h2 className='add-student-modal_header'>
            Booking Confirmation
          </h2>
          <p className='add-student-modal-text text-center'>
            You will be joining {sessionData?.tutorName} on {sessionData?.date} to study {sessionData?.subject}.
          </p>

          <p className='add-student-modal-text mt-[15px]'>
            Cost: 1 token
          </p>
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
