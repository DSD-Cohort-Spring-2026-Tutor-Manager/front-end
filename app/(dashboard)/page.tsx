'use client';
import { useContext, useEffect } from 'react';
import { CreditContext } from '@/app/_components/CreditContext/CreditContext';
import Databox from '../_components/DataBox/Databox';
import './dashboard.css';
import { TutortoiseClient } from '../_api/tutortoiseClient';
function Home() {
  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error('CreditContext is missing. Wrap app in CreditProvider.');

  const { credits, addCredits } = ctx;

  useEffect(() => {
    TutortoiseClient.getBalance('1').then((res: number) => {
      addCredits(-credits + res);
    });
  }, []);

  return (
    <main className='dashboard'>
      <section className='dashboard__data-row'>
        <Databox title='Student' value='Zayn' href='/student' cta='switch' />
        <Databox
          title='Credits available'
          value={credits.toString()}
          href='/credits'
          cta='Buy'
        />
      </section>
    </main>
  );
}

export default Home;
