'use client';
import { useState } from 'react';

import Databox from '../_components/DataBox/Databox';
import './dashboard.css';
function Home() {
  const [credits, setCredits] = useState(3);
  const addCredits = () => {
    setCredits((prev) => prev + 1);
  };

  const subtractCredits = () => {
    setCredits((prev) => prev - 1);
  };
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
      <button onClick={addCredits}>add credits</button>
      <button onClick={subtractCredits}>subtract credits</button>
    </main>
  );
}

export default Home;
