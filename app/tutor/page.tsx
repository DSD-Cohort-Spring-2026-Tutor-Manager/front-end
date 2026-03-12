'use client';
import './dashboard.css';

import TablePanel from '../_components/DataTable/TablePanel';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TutortoiseClient } from '../_api/tutortoiseClient';
import Databox from '../_components/DataBox/Databox';
import { useAuthStore } from '@/store/authStore';

function Home() {
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const tableSectionRef = useRef<HTMLElement>(null);

  const [activeTab, setActiveTab] = useState(0);

  const user = useAuthStore((s) => s.user);
  const tutorId = user?.id ?? '';

  const fetchSessions = useCallback(
    (status: 'scheduled' | 'completed') => {
      if (!tutorId) return;
      TutortoiseClient.getTutorSessions(String(tutorId), status).then(
        (sessions) => {
          const data = Array.isArray(sessions) ? sessions : [];
          if (status === 'scheduled') setUpcomingSessions(data);
          else setCompletedSessions(data);
        },
      );
    },
    [tutorId],
  );

  useEffect(() => {
    fetchSessions('scheduled');
  }, [fetchSessions]);

  const handleTabChange = useCallback(
    (tabIndex: number) => {
      setActiveTab(tabIndex);
      fetchSessions(tabIndex === 0 ? 'scheduled' : 'completed');
    },
    [fetchSessions],
  );

  const handleNoteSaved = useCallback(() => {
    fetchSessions(activeTab === 0 ? 'scheduled' : 'completed');
  }, [activeTab, fetchSessions]);

  return (
    <main className='dashboard'>
      <section className='dashboard__data-row' style={{ margin: '20px 20px' }}>
        <div className='databox-sm w-full h-80 bg-(--Primary) rounded-xl relative'>
          <Databox title='Total Session' value={completedSessions.length} />
        </div>
        <div className='databox-sm w-full h-80 bg-(--Primary) rounded-xl relative'>
          <Databox title='Upcoming Session' value={upcomingSessions.length} />
        </div>
        <div className='databox-sm w-full h-80 bg-(--Primary) rounded-xl relative'>
          <Databox title='Today Session' value={todaySessions.length} />
        </div>
      </section>

      <section ref={tableSectionRef} id='table' style={{ margin: '20px 0' }}>
        <TablePanel
          upcomingSessions={upcomingSessions}
          completedSessions={completedSessions}
          onTabChange={handleTabChange}
          onNoteSaved={handleNoteSaved}
        />
      </section>
    </main>
  );
}

export default Home;
