import React from 'react'
import './Modal.css'

type ModalType = 'confirm'

interface ModalButton {
    text: string
    onClick: () => void
}

const Modal = ({
    type,
    text,
    buttons
}: {
    type?: ModalType | undefined,
    text: string,
    buttons: ModalButton[]
}) => {
  return (
    <div className="modal">
        <div className='modal-content'>
            <p className="modal-text">
                {text}
            </p>
            <div id="modal__buttons-container">
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
  )
}

export default Modal