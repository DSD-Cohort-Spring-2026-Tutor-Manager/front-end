'use client';

import { useContext } from 'react';

import CreditsViewBar from '@/app/_components/CreditsViewbar/CreditsViewBar';
import { CreditContext } from '@/app/_components/CreditContext/CreditContext';
import AvailableSessionsTable from '@/app/_components/DataTable/AvailableSessionsTable/AvailableSessionsTable';
import './../dashboard.css';
import './tutoring.css';

function page() {
  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error('CreditContext is missing. Wrap app in CreditProvider.');

  const { credits } = ctx;

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
