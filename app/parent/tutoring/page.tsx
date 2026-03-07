'use client';

import { useContext, useEffect, useState } from 'react';

import CreditsViewBar from '@/app/_components/CreditsViewbar/CreditsViewBar';
import { ParentContext } from '../../context/ParentContext';
import AvailableSessionsTable from '@/app/_components/DataTable/AvailableSessionsTable/AvailableSessionsTable';
import Modal from '@/app/_components/Modal/Modal';
import { TutortoiseClient } from '@/app/_api/tutortoiseClient';
import { Session } from '../../types/types';
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

function toSessionRow(session: Session): SessionRow {
  const dt = session.datetimeStarted
    ? new Date(session.datetimeStarted)
    : null;
  return {
    id: session.sessionId,
    tutor: session.tutorName ?? '—',
    subject: session.subject ?? '—',
    date: dt ? dt.toLocaleDateString('en-US') : '—',
    time: dt
      ? dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : '—',
  };
}

function Page() {
  const parentCtx = useContext(ParentContext);
  if (!parentCtx)
    throw new Error('ParentContext is missing. Wrap app in ParentProvider.');

  const { parentDetails, setParentDetails } = parentCtx;
  const { creditBalance } = parentDetails;

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRow | null>(
    null,
  );
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState(false);

  useEffect(() => {
    TutortoiseClient.getOpenSessions()
      .then((data) => {
        if (!data) {
          setSessionsError(true);
          setSessions([]);
          return;
        }
        const raw: Session[] = Array.isArray(data) ? data : [];
        setSessions(raw.map(toSessionRow));
      })
      .catch(() => setSessionsError(true))
      .finally(() => setSessionsLoading(false));
  }, []);

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

    const currentParentId = parentDetails.parentId;
    const currentStudentId =
      parentDetails.selectedStudent?.studentId ||
      (parentDetails.students && parentDetails.students.length > 0
        ? parentDetails.students[0].studentId
        : undefined);

    if (!currentParentId || !currentStudentId) {
      console.error('Cannot book session: Missing parent or student ID');
      return;
    }

    try {
      await TutortoiseClient.bookSession(
        currentParentId,
        currentStudentId,
        Number(selectedSession.id),
      );

      parentCtx.addCredits(-1);
      // Remove the booked session from the list optimistically
      setSessions((prev) => prev.filter((s) => s.id !== selectedSession.id));
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
                  (s) => s.studentId === Number(e.target.value),
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
            value={parentDetails.creditBalance.toString()}
            href='/parent/credits'
            cta='Need more credits?'
          />
        </div>
        {sessionsLoading && (
          <p className='tutoring__status'>Loading sessions…</p>
        )}
        {!sessionsLoading && sessionsError && sessions.length === 0 && (
          <p className='tutoring__status tutoring__status--error'>
            Failed to load sessions. Please try again.
          </p>
        )}
        {!sessionsLoading && !sessionsError && sessions.length > 0 && (
          <AvailableSessionsTable sessions={sessions} onJoin={handleJoinClick} />
        )}
        {!sessionsLoading && !sessionsError && sessions.length === 0 && (
          <p className='tutoring__status'>No sessions available.</p>
        )}
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
