'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import StudentNotePanel from '../StudentNotePanel/StudentNotePanel';
import './StudentNoteModal.css';

interface StudentNoteModalProps {
  isOpen: boolean;
  studentId: number;
  studentName: string;
  tutorId: number;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function StudentNoteModal({
  isOpen,
  studentId,
  studentName,
  tutorId,
  onClose,
  onSaveSuccess,
}: StudentNoteModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className='student-note-modal__overlay'
      onClick={onClose}
      role='presentation'
    >
      <div
        className='student-note-modal__content'
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby='student-note-modal-title'
      >
        <div className='student-note-modal__header'>
          <h2
            id='student-note-modal-title'
            className='student-note-modal__title'
          >
            Notes — {studentName}
          </h2>
          <button
            className='student-note-modal__close-btn'
            onClick={onClose}
            aria-label='Close notes modal'
          >
            <X size={20} />
          </button>
        </div>

        <div className='student-note-modal__body'>
          <StudentNotePanel
            studentId={studentId}
            studentName={studentName}
            tutorId={tutorId}
            onClose={onClose}
            onSaveSuccess={onSaveSuccess}
          />
        </div>
      </div>
    </div>
  );
}
