'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Databox from '../_components/DataBox/Databox';
import DataboxMed from '../_components/DataBox/DataboxMed';
import CreditsViewBar from '../_components/CreditsViewbar/CreditsViewBar';
import BookedSessionsTable from '../_components/DataTable/BookedSessionsTable/BookedSessionsTable';
import './dashboard.css';
import { TutortoiseClient } from '../_api/tutortoiseClient';
import Modal from '../_components/Modal/Modal';
import Alert from '../_components/Alert/Alert';
import { ParentContext } from '../context/ParentContext';
import { useAuthStore } from '@/store/authStore';

type Student = {
  studentId: number;
  parentId: number;
  studentName: string;
  notes: string;
  sessionsCompleted: number;
  previousScore: number;
  latestScore: number;
  sessions: Session[];
};

type Session = {
  sessionId: number;
  parentId: number;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  notes: string;
  subject: string;
  tutorId: number;
  tutorName: string;
  sessionStatus: string;
  datetimeStarted: string;
  durationHours: number;
  assessmentPointsEarned: number;
  assessmentPointsGoal: number;
  assessmentPointsMax: number;
};

type SessionRow = {
  id: number | string;
  date: string;
  tutor: string;
  subject: string;
  time: string;
};

function toSessionRow(session: Session): SessionRow {
  const dt = session.datetimeStarted ? new Date(session.datetimeStarted) : null;
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

function Home() {
  const router = useRouter();
  const [isAddStudentModalOpen, setAddStudentModalIsOpen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertExiting, setIsAlertExiting] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const parentCtx = useContext(ParentContext);
  if (!parentCtx)
    throw new Error(
      'ParentContext is missing. Wrap the app in ParentProvider.',
    );

  const { parentDetails, setParentDetails } = parentCtx;

  // Auto-select the first student once the API response has populated the list
  useEffect(() => {
    if (parentDetails.students.length > 0 && !parentDetails.selectedStudent) {
      setParentDetails((prev) => ({
        ...prev,
        selectedStudent: prev.students[0],
      }));
    }
  }, [parentDetails.students]);

  function getCompletedSessions(sessions: Session[], studentId: number) {
    return sessions.filter(
      (s) => s.sessionStatus === 'completed' && s.studentId === studentId,
    );
  }

  function getLatestTwo(sessions: Session[]) {
    return [...sessions]
      .sort(
        (a, b) =>
          new Date(b.datetimeStarted).getTime() -
          new Date(a.datetimeStarted).getTime(),
      )
      .slice(0, 2);
  }

  function addStudent() {
    const firstName = (document.getElementById('firstName') as any)?.value;
    const lastName = (document.getElementById('lastName') as any)?.value;

    const showSuccessAlert = () => {
      setIsAlertExiting(true);
      setIsAlertVisible(true);

      requestAnimationFrame(() => {
        setIsAlertExiting(false);
      });
    };

    if (!firstName || !lastName) {
      return;
    }
    const parentId = parentDetails.parentId;
    if (!parentId) return;

    TutortoiseClient.addStudent(parentId, firstName, lastName)
      .then((res: Student) => {
        setParentDetails((prev) => ({
          ...prev,
          students: [...prev.students, res],
          selectedStudent: prev.selectedStudent ?? res,
        }));
        showSuccessAlert();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setAddStudentModalIsOpen(false);
      });
  }

  // sessions fetch — called once on mount; all students share the same session pool
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await TutortoiseClient.getAllSessions();
        const allSessions: Session[] = Array.isArray(data)
          ? data
          : (data.sessions ?? []);
        setSessions(allSessions);
      } catch (err) {
        console.error('Failed to load the sessions:', err);
      } finally {
        setSessionsLoading(false);
      }
    };
    loadSessions();
  }, []);

  // Derived — recomputed inline on every render; no extra state or effect needed
  const completedSess =
    parentDetails.selectedStudent?.studentId != null
      ? getCompletedSessions(sessions, parentDetails.selectedStudent.studentId)
      : [];
  const latestTwo = getLatestTwo(completedSess);

  const bookedSessions =
    parentDetails.selectedStudent?.studentId != null
      ? sessions
          .filter(
            (s) =>
              s.sessionStatus === 'scheduled' &&
              s.studentId === parentDetails.selectedStudent?.studentId &&
              s.parentId === parentDetails.parentId,
          )
          .sort(
            (a, b) =>
              new Date(a.datetimeStarted).getTime() -
              new Date(b.datetimeStarted).getTime(),
          )
          .map(toSessionRow)
      : [];

  // Alert

  useEffect(() => {
    if (!isAlertVisible) return;

    const stayTimer = setTimeout(() => {
      setIsAlertExiting(true);
    }, 3000);

    const removeTimer = setTimeout(() => {
      setIsAlertVisible(false);
      setIsAlertExiting(false);
    }, 3400);

    return () => {
      clearTimeout(stayTimer);
      clearTimeout(removeTimer);
    };
  }, [isAlertVisible]);

  const selectedStudent = parentDetails.selectedStudent;

  return (
    <main className='dashboard overflow-x-hidden h-full'>
      <CreditsViewBar
        value={parentDetails.creditBalance.toString()}
        href='/parent/credits'
        cta='Need more credits?'
      />
      <section className='dashboard__data-row'>
        <Databox
          title='Student'
          value={selectedStudent?.studentName?.split(' ')[0] ?? '—'}
          href='/parent/student'
          cta='switch'
          topRightIcon={{
            src: '/icons/Add user icon.svg',
            alt: 'Add student button',
            onClick: () => setAddStudentModalIsOpen(true),
          }}
          dropdownContent={parentDetails.students.map((s) => ({
            label: s.studentName,
            studentId: s.studentId,
            parentId: s.parentId,
          }))}
          dropdownOnChange={(selected) => {
            const match = parentDetails.students.find(
              (s) => s.studentId === selected.studentId,
            );
            if (match) {
              setParentDetails((prev) => ({ ...prev, selectedStudent: match }));
            }
          }}
        />
        <Databox
          title='Sessions completed'
          value={completedSess.length.toString()}
        />
        <DataboxMed latest={latestTwo} />
        {isAddStudentModalOpen && (
          <Modal
            type='add student'
            text=''
            buttons={[
              {
                className: 'add-student-confirm-button',
                text: 'Add Student',
                onClick: () => addStudent(),
              },
              {
                className: 'add-student-cancel-button',
                text: 'Cancel',
                onClick: () => setAddStudentModalIsOpen(false),
              },
            ]}
          />
        )}
      </section>
      <BookedSessionsTable
        sessions={bookedSessions}
        loading={sessionsLoading}
        onFindTutor={() => router.push('/parent/tutoring')}
      />
      <div className='alert-layer'>
        {isAlertVisible && (
          <Alert
            type='success'
            text='Student Created!'
            className={isAlertExiting ? 'alert-exit' : 'alert-enter'}
          />
        )}
      </div>
    </main>
  );
}

export default Home;
