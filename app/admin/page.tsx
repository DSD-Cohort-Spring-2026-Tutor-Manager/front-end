'use client';
import './dashboard.css';

import { useEffect, useState } from 'react';
import { TutortoiseClient } from '../_api/tutortoiseClient';
import Databox from '../_components/DataBox/Databox';

function Home() {
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [fullSessions, setFullSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        setStudents([...new Set(sessions.map((s) => s.studentId))]);
        setTutors([...new Set(sessions.map((s) => s.tutorId))]);
        setUpcomingSessions(
          sessions.filter((s) => s.sessionStatus === 'scheduled'),
        );
        setFullSessions(sessions.filter((s) => s));
        setTodaySessions(
          sessions.filter(
            (s) =>
              s.datetimeStarted?.split('T')[0] ===
              new Date().toISOString().split('T')[0],
          ),
        );
      }
    });
  }, []);

  return (
    <main className='dashboard overflow-x-hidden h-full'>
      <section className='dashboard__data-row' style={{ margin: '20px 20px' }}>
        <Databox title='Credits Bought' subtitle='This Week' value='9' />
        <Databox
          title='Sessions Full'
          subtitle='This Week'
          value={todaySessions.length}
        />
      </section>
    </main>
  );
}

export default Home;
