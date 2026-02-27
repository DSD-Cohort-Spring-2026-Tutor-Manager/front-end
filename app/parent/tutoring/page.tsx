'use client';

import { useContext, useEffect } from 'react';

import CreditsViewBar from '@/app/_components/CreditsViewbar/CreditsViewBar';
import AvailableSessionsTable from '@/app/_components/DataTable/AvailableSessionsTable/AvailableSessionsTable';
import './../dashboard.css';
import './tutoring.css';
import { ParentContext } from '@/app/context/ParentContext';

function page() {
  const parentCtx = useContext(ParentContext);
  if (!parentCtx)
    throw new Error('ParentContext is missing. Wrap the app in StudentProvider.');

  const { parentDetails, setParentDetails } = parentCtx;

  const loadSessions = async () => {
    
  }

  const selectStudentFromDropdown = (student: any) => {
    // Handle all the filtering here
    console.debug('Selected student:', student.studentName);

  }

  useEffect(() => {
    loadSessions();
  }, [])

  const defaultSessions = [
    {
      id: 1,
      date: '02/20/2026',
      tutor: 'Vince Villanueva',
      subject: 'Algebra II',
      time: '3:00PM',
    }
  ];

  return (
    <main className='dashboard'>
      <div className='tutoring'>
        <div className='tutoring__nav'>
          <label className='tutoring__selector' htmlFor='students'>
            Choose a student:{' '}
            <select name='students' id='students' onChange={(e) => selectStudentFromDropdown(e.target.value)}>
              {parentDetails.students?.map((s: any, index: number) => (
                <option key={`option-${index}`} value='student'>
                  {s.studentName.split(' ')[0]}
                </option>
              ))}
            </select>
          </label>

          <CreditsViewBar
            value={parentDetails.creditBalance.toString()}
            href='/parent/credits'
            cta='Need more credits?'
          />
        </div>
        <AvailableSessionsTable
          onJoin={(session) => {
            console.log('Joining session:', session);
          }}
        />
      </div>
    </main>
  );
}

export default page;
