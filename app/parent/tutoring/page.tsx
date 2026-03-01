'use client';

import { useContext, useEffect, useState } from 'react';

import CreditsViewBar from '@/app/_components/CreditsViewbar/CreditsViewBar';
import AvailableSessionsTable from '@/app/_components/DataTable/AvailableSessionsTable/AvailableSessionsTable';
import './tutoring.css';
import { ParentContext } from '@/app/context/ParentContext';
import { TutortoiseClient } from '@/app/_api/tutortoiseClient';
import { Session, Student } from '@/app/types/types';
import Modal from '@/app/_components/Modal/Modal';

function page() {
  const parentId = 1;
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(undefined);

  const parentCtx = useContext(ParentContext);
  if (!parentCtx)
    throw new Error('ParentContext is missing. Wrap the app in StudentProvider.');

  const { parentDetails, setParentDetails } = parentCtx;

  const loadParentDetails = async () => {
    const parent: any = await TutortoiseClient.getParentDetails(parentId);
    
    setParentDetails({
      ...parent,
      selectedStudent: parentDetails.selectedStudent || parent.students?.[0]
    });
  }

  const loadAvailableSessions = async () => {
    const sessions: Session[] = await TutortoiseClient.getOpenSessions();
    if (!Array.isArray(sessions)) {
      return;
    }

    // const filteredSessions = sessions.filter((s: Session) => s.parentId === parentId);
    // console.debug('Filtered sessions:', filteredSessions);
    // setAvailableSessions(filteredSessions);
    setAvailableSessions(sessions);
  }

  const selectStudentFromDropdown = (student: any) => {
    // Handle all the filtering here
    console.debug('Selected student:', student.studentName);
    setParentDetails({
      ...parentDetails, selectedStudent: student
    })
  }

  const getFormattedDate = (date: Date) => date.toLocaleDateString('en-US');
  const getFormattedTime = (date: Date) => {
    const isAm = date.getHours() <= 11;
    let newHours = date.getHours() % 12;
    if (newHours === 0 ) newHours = 12;

    return `${newHours}:${date.getMinutes()} ${isAm ? 'AM':'PM'}`;
  }

  const convertSessionsToSessionRows = (sessions: Session[]) => sessions.map(session => {
    // Expect ISO 8601 datetime string
    const dateObj = new Date(session.datetimeStarted);
    const hourString = getFormattedTime(dateObj);
    const timeString = getFormattedDate(dateObj);
    return {
      id: session.sessionId,
      date: hourString,
      tutor: session.tutorName,
      subject: session.subject,
      time: timeString
    }
  });

  const bookSession = async () => {
    console.debug('Book session:', selectedSession);
    if (selectedSession === undefined) {
      return;
    }
    const session = selectedSession;
    setSelectedSession(undefined);

    // Make API call to book session
    await TutortoiseClient.bookSession(
      parentId,
      parentDetails.selectedStudent?.studentId,
      session.sessionId
    );
    setShowModal(false);

    // Refresh sessions
    loadAvailableSessions();
  };

  const cancel = async () => {
    setSelectedSession(undefined);
    setShowModal(false);
  };

  useEffect(() => {
    loadParentDetails();
    loadAvailableSessions();
  }, []);

  return (
    <main className='dashboard'>
      <div className='tutoring'>
        <div className='tutoring__nav'>
          <label className='tutoring__selector' htmlFor='students'>
            Choose a student:{' '}
            <select name='students' id='students' onChange={(e) => selectStudentFromDropdown(e.target.value)}>
              {parentDetails.students?.filter((s: Student) => s.studentId !== parentDetails.selectedStudent.studentId)
                .map((s: any, index: number) => (
                  <option key={`option-${index}`} value='student'>
                    {s.studentName.split(' ')[0]}
                  </option>
                ))}
            </select>
          </label>

          <CreditsViewBar
            value={parentDetails.creditBalance?.toString()}
            href='/parent/credits'
            cta='Need more credits?'
          />
        </div>
        <AvailableSessionsTable
          sessions={convertSessionsToSessionRows(availableSessions)}
          onJoin={(session) => {
            console.debug('Joining session:', session);
            const matchingSession = availableSessions.find((s: Session) => s.sessionId === session.id);
            console.debug('Found session matching session row object:', matchingSession);
            setSelectedSession(matchingSession);
            setShowModal(true);
          }}
        />
      </div>
      {
        showModal && 
        <Modal
          type='book session'
          sessionData={{
            tutorName: selectedSession?.tutorName || '[Tutor]',
            date: selectedSession?.datetimeStarted || '[Date]',
            subject: selectedSession?.subject || '[Subject]'
          }
          }
          buttons={[
            {
              text: 'Confirm',
              onClick: () => bookSession(),
              className: 'add-student-confirm-button'
            },
            {
              text: 'Cancel',
              onClick: () => cancel()
            }
          ]}
        />
      }
      
    </main>
  );
}

export default page;
