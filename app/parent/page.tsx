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
import { ParentContext } from '../context/ParentContext';

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

type Parent = {
  "status": string,
  "operationStatus": string,
  "message": string,
  "parentId": number,
  "parentName": string,
  "parentEmail": string,
  "sessionCount": number,
  "creditBalance": number,
  "students": Student[]
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
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [completedSess, setCompletedSess] = useState<Session[]>([]);
  const [latestTwo, setLatestTwo] = useState<Session[]>([]);

  const parentCtx = useContext(ParentContext);
  if (!parentCtx)
    throw new Error('StudentContext is missing. Wrap the app in StudentProvider.');

  const { parentDetails, setParentDetails } = parentCtx;

  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error('CreditContext is missing. Wrap app in CreditProvider.');

  const { credits, addCredits } = ctx;

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

  const addStudent = async () => {
    const firstName = (document.getElementById('firstName') as any)?.value;
    const lastName = (document.getElementById('lastName') as any)?.value;

    if (!firstName || !lastName) {
      return;
    }

    const showSuccessAlert = () => {
      setIsAlertExiting(true);
      setIsAlertVisible(true);

      requestAnimationFrame(() => {
        setIsAlertExiting(false);
      });
    };

    try {
      const student = TutortoiseClient.addStudent(1, firstName, lastName);
      setParentDetails({ ...parentDetails, selectedStudent: student });
      showSuccessAlert();
    } catch (err) {
      console.error('Failed to add student:', err);
    } finally {
      setAddStudentModalIsOpen(false);
    }
  };

  const loadParentDetails = async () => {
    TutortoiseClient.getParentDetails(1)
    .then((res: Parent) => {
      setParentDetails({
        ...res,
        selectedStudent: parentDetails.selectedStudent || res.students[0]
      })
      addCredits(-credits + res.creditBalance);
    })
  }

  const loadSessions = async () => {
    try {
      const data = await TutortoiseClient.getAllSessions();
      const allSessions: Session[] = Array.isArray(data)
        ? data
        : (data.sessions ?? []);
      setAllSessions(allSessions);
    } catch (err) {
      console.error('Failed to load the sessions:', err);
    }
  };

  const setStudentSpecificValuesFromSessions = (sessions: Session[]) => {
    const completedSessions = getCompletedSessions(sessions, parentDetails.selectedStudent?.studentId);
    const latest = getLatestTwo(completedSessions);
    setCompletedSess(completedSessions);
    setLatestTwo(latest);
  };

  // Fetch parent details and session details on start
  useEffect(() => {
    loadParentDetails();
    loadSessions();
  }, []);

  useEffect(() => {
    setStudentSpecificValuesFromSessions(allSessions);
  }, [allSessions, parentDetails.selectedStudent]);


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
    <main className='dashboard overflow-x-hidden h-full'>
      <CreditsViewBar
        value={credits.toString()}
        href='/parent/credits'
        cta='Need more credits?'
      />
      <section className='dashboard__data-row'>
        <Databox
          title='Student'
          value={parentDetails.selectedStudent?.studentName?.split(' ')[0]}
          href='/student'
          cta='switch'
          topRightIcon={{
            src: '/icons/Add user icon.svg',
            alt: 'Add student button',
            onClick: () => setAddStudentModalIsOpen(true),
          }}
          dropdownContent={
            parentDetails.students.map((s: Student) => (
              {label: s?.studentName?.split(' ')[0], studentId: s.studentId}
            ))
          }
          dropdownOnChange={(s) => {
            setParentDetails({
            ...parentDetails, selectedStudent: parentDetails.students.find((availableStudent: Student) => s.studentId === availableStudent.studentId)
          });
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
