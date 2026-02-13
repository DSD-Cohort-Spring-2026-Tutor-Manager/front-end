'use client';
import { useState } from 'react';

import Databox from '../_components/DataBox/Databox';
import './dashboard.css';
function Home() {
  const [credits, setCredits] = useState('3');
  return (
    <main className='dashboard'>
      <section className='dashboard__data-row'>
        <Databox title='Student' value='Zayn' href='/student' cta='switch' />
        <Databox
          title='Credits available'
          value={credits}
          href='/credits'
          cta='Buy'
        />
      </section>
    </main>
  );
}

export default Home;
