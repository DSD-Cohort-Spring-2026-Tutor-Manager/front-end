'use client';

import { useContext, useState } from 'react';

import CreditsViewBar from '@/app/_components/CreditsViewbar/CreditsViewBar';
import { CreditContext } from '@/app/_components/CreditContext/CreditContext';
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

function page() {
  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error('CreditContext is missing. Wrap app in CreditProvider.');

  const { credits, setCredits } = ctx;

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRow | null>(null);

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
    
    // In a real app we'd get the actual selected studentId from state
    // For now we'll mock parentId and studentId as 1 to match existing hardcoded logic
    try {
      await TutortoiseClient.bookSession(1, 1, Number(selectedSession.id));
      setCredits(credits - 1);
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
            <select name='students' id='students'>
              <option value='student'>Zayn</option>
              <option value='student'>Leo</option>
              <option value='student'>Scarlet</option>
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
          <div className="flex flex-col items-center">
            <h2 className="add-student-modal_header mb-4 text-center">
              Booking Confirmation
            </h2>
            <p className="text-lg text-gray-700 mb-4 text-center">
              You will be joining {selectedSession.tutor} on{' '}
              {selectedSession.date} at {selectedSession.time} to study{' '}
              {selectedSession.subject}
            </p>
            <p className="text-lg text-gray-800 font-semibold mt-4 text-center">
              Cost: 1 Token
            </p>
            <div className="add-student-modal-buttons mt-4">
              <button
                className="modal-button add-student-confirm-button"
                onClick={handleConfirmBooking}
              >
                Confirm
              </button>
              <button
                className="modal-button add-student-cancel-button"
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

export default page;
