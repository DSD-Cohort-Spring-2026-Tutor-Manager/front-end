'use client';
import { useContext } from 'react';
import { CreditContext } from '@/app/_components/CreditContext/CreditContext';
import Databox from '../_components/DataBox/Databox';
import './dashboard.css';
function Home() {
  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error('CreditContext is missing. Wrap app in CreditProvider.');

  const { credits, addCredits } = ctx;

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
