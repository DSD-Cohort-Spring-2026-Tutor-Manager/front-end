'use client';
import DataContainer from '@/app/_components/DataBox/DataContainer';
import './dashboard.css';

import TablePanel from '../_components/DataTable/TablePanel';

function Home() {
  return (
    <main className='dashboard'>
      <section className='dashboard__data-row' style={{ margin: '20px 20px' }}>
        <DataContainer title='Assigned Students' value='10' />
        <DataContainer title='Upcoming Session' value='8' />
        <DataContainer title='Today Session' value='2' />
      </section>
      <section style={{ margin: '20px 0' }}>
        <TablePanel />
      </section>
    </main>
  );
}

export default Home;
