'use client';
import { useContext, useEffect, useState } from 'react';
import { CreditContext } from '@/app/_components/CreditContext/CreditContext';
import Databox from '../_components/DataBox/Databox';
import DataboxMed from '../_components/DataBox/DataboxMed';
import CreditsViewBar from '../_components/CreditsViewbar/CreditsViewBar';
import './dashboard.css';
import { TutortoiseClient } from '../_api/tutortoiseClient';
import Modal from '../_components/Modal/Modal';
import Alert from '../_components/Alert/Alert';
import { StudentContext } from '../context/StudentContext';

type Student = {
  studentId: number,
  parentId: number,
  studentName: string,
  notes: string,
  sessionsCompleted: number,
  previousScore: number,
  latestScore: number,
  sessions: Session[]
}

type Session = {
  sessionId: number;
  parentId: number;
  studentId: number;
  tutorId: number;
  sessionStatus: string;
  datetimeStarted: string;
  durationHours: number;
  assessmentPointsEarned: number;
  assessmentPointsGoal: number;
  assessmentPointsMax: number;
};

function Home() {
  const [isAddStudentModalOpen, setAddStudentModalIsOpen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertExiting, setIsAlertExiting] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [completedSess, setCompletedSess] = useState<Session[]>([]);
  const [latestTwo, setLatesTwo] = useState<Session[]>([]);

  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error('CreditContext is missing. Wrap app in CreditProvider.');

  const { credits, addCredits } = ctx;

  const studentCtx = useContext(StudentContext);
  if (!studentCtx)
    throw new Error('StudentContext is missing. Wrap the app in StudentProvider.');

  const { student, setStudent } = studentCtx;

  function getCompletedSessions(sessions: Session[], studentId: number) {
    return sessions.filter(
      (s) => s.sessionStatus === 'completed' && s.studentId === studentId
    )
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
    TutortoiseClient.addStudent(1, firstName, lastName)
      .then((res: Student) => {
        setStudent(res);
        showSuccessAlert();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setAddStudentModalIsOpen(false);
      });
  };

  // balance fetch
  useEffect(() => {
    TutortoiseClient.getBalance('1').then((res: number) => {
      addCredits(-credits + res);
    });
  }, []);

  // sessions fetch
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await TutortoiseClient.getAllSessions();
        const allSessions: Session[] = Array.isArray(data)
          ? data
          : (data.sessions ?? []);

        const completedSessions = getCompletedSessions(allSessions, student?.studentId);
        const latest = getLatestTwo(completedSessions);

        setSessions(allSessions);
        setCompletedSess(completedSessions);
        setLatesTwo(latest);
      } catch (err) {
        console.error('Failed to load the sessions:', err);
      }
    };
    loadSessions();
  }, [student]);

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

  return (
    <main className='dashboard overflow-x-hidden'>
      <CreditsViewBar
        value={credits.toString()}
        href='/parent/credits'
        cta='Need more credits?'
      />
      <section className='dashboard__data-row'>
        <Databox
          title='Student'
          value={student.studentName.split(' ')[0]}
          href='/student'
          cta='switch'
          topRightIcon={{
            src: '/icons/Add user icon.svg',
            alt: 'Add student button',
            onClick: () => setAddStudentModalIsOpen(true),
          }}
        />
        <Databox
          title='Sessions completed'
          value={completedSess.length.toString()}
          href='/student'
          cta='View'
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
              }
            ]}
          />
        )}
      </section>
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
