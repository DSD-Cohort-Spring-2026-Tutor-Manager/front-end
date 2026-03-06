'use client';

import { useContext, useState } from 'react';

import CreditsViewBar from '@/app/_components/CreditsViewbar/CreditsViewBar';
import { CreditContext } from '@/app/_components/CreditContext/CreditContext';
import { ParentContext } from '../../context/ParentContext';
import AvailableSessionsTable from '@/app/_components/DataTable/AvailableSessionsTable/AvailableSessionsTable';
import Modal from '@/app/_components/Modal/Modal';
import { TutortoiseClient } from '@/app/_api/tutortoiseClient';
import './../dashboard.css';
import './tutoring.css';

// Type from AvailableSessionsTable
type SessionRow = {
  id: number | string;
  date: string;
  tutor: string;
  subject: string;
  time: string;
};

function Page() {
  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error('CreditContext is missing. Wrap app in CreditProvider.');

  const { credits, addCredits } = ctx;

  const parentCtx = useContext(ParentContext);
  if (!parentCtx)
    throw new Error('ParentContext is missing. Wrap app in ParentProvider.');

  const { parentDetails, setParentDetails } = parentCtx;
  const { creditBalance } = parentDetails; // Extract creditBalance from parentDetails

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRow | null>(
    null,
  );

  const handleJoinClick = (session: SessionRow) => {
    setSelectedSession(session);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedSession(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSession) return;

    const currentParentId = parentDetails.parentId || 1;
    // Fallback to the first student's ID if no student is explicitly selected, otherwise default to 1
    const currentStudentId =
      parentDetails.selectedStudent?.studentId ||
      (parentDetails.students && parentDetails.students.length > 0
        ? parentDetails.students[0].studentId
        : 1);

    try {
      await TutortoiseClient.bookSession(
        currentParentId,
        currentStudentId,
        Number(selectedSession.id),
      );

      // Keep both CreditContext and ParentContext in sync
      addCredits(-1);
      parentCtx.addCredits(-1);
    } catch (error) {
      console.error('Failed to book session:', error);
    } finally {
      closeBookingModal();
    }
  };

  return (
    <main className='dashboard'>
      <div className='tutoring'>
        <div className='tutoring__nav'>
          <label className='tutoring__selector' htmlFor='students'>
            Choose a student:{' '}
            <select 
              name='students' 
              id='students'
              value={parentDetails.selectedStudent?.studentId || ''}
              onChange={(e) => {
                const selectedStudent = parentDetails.students?.find(
                  (s) => s.studentId === Number(e.target.value)
                );
                if (selectedStudent) {
                  setParentDetails({ ...parentDetails, selectedStudent });
                }
              }}
            >
              {parentDetails.students && parentDetails.students.length > 0 ? (
                parentDetails.students.map((student) => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.studentName}
                  </option>
                ))
              ) : (
                <option value='' disabled>
                  No students available
                </option>
              )}
            </select>
          </label>

          <CreditsViewBar
            value={credits.toString()}
            href='/parent/credits'
            cta='Need more credits?'
          />
        </div>
        <AvailableSessionsTable onJoin={handleJoinClick} />
      </div>

      {isBookingModalOpen && selectedSession && (
        <Modal buttons={[]}>
          <div className='flex flex-col items-center'>
            <h2 className='add-student-modal_header mb-4 text-center'>
              Booking Confirmation
            </h2>
            <p className='text-lg text-gray-700 mb-4 text-center'>
              You will be joining {selectedSession.tutor} on{' '}
              {selectedSession.date} at {selectedSession.time} to study{' '}
              {selectedSession.subject}
            </p>
            <p className='text-lg text-gray-800 font-semibold mt-4 text-center'>
              Cost: 1 Token
            </p>
            <p>Available Credits: {creditBalance}</p>
            <div className='add-student-modal-buttons mt-4'>
              <button
                className='modal-button add-student-confirm-button'
                onClick={handleConfirmBooking}
              >
                Confirm
              </button>
              <button
                className='modal-button add-student-cancel-button'
                onClick={closeBookingModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

export default Page;
