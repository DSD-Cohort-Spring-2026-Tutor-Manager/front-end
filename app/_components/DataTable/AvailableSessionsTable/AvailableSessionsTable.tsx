'use client';

import './AvailableSessionsTable.css';

type SessionRow = {
  id: number | string;
  date: string;
  tutor: string;
  subject: string;
  time: string;
};

type AvailableSessionsTableProps = {
  sessions?: SessionRow[];
  onJoin?: (session: SessionRow) => void;
};

const defaultSessions: SessionRow[] = [
  {
    id: 1,
    date: '02/20/2026',
    tutor: 'Vince Villanueva',
    subject: 'Algebra II',
    time: '3:00PM',
  },
  {
    id: 2,
    date: '02/20/2026',
    tutor: 'John Smith',
    subject: 'English III',
    time: '4:00PM',
  },
  {
    id: 3,
    date: '02/20/2026',
    tutor: 'Jane Doe',
    subject: 'Science I',
    time: '8:00PM',
  },
  {
    id: 4,
    date: '02/20/2026',
    tutor: 'Hello World',
    subject: 'World History II',
    time: '10:00AM',
  },
  {
    id: 5,
    date: '02/20/2026',
    tutor: 'Harambe Gorilla',
    subject: 'Algebra II',
    time: '11:00AM',
  },
];

export default function AvailableSessionsTable({
  sessions = defaultSessions,
  onJoin,
}: AvailableSessionsTableProps) {
  return (
    <section className='sessions-table'>
      <div className='sessions-table__header'>
        <h2 className='sessions-table__title'>Available Tutoring Sessions</h2>
      </div>

      <div className='sessions-table__divider' />

      <div className='sessions-table__labels' aria-hidden='true'>
        <span>Date</span>
        <span>Tutor</span>
        <span>Subject</span>
        <span>Time</span>
        <span>Option</span>
      </div>

      <ul className='sessions-table__list'>
        {sessions.map((session) => (
          <li key={session.id} className='sessions-table__row'>
            <span className='sessions-table__cell'>{session.date}</span>
            <span className='sessions-table__cell'>{session.tutor}</span>
            <span className='sessions-table__cell'>{session.subject}</span>
            <span className='sessions-table__cell'>{session.time}</span>
            <span className='sessions-table__cell sessions-table__cell--action'>
              <button
                type='button'
                className='sessions-table__join-btn'
                onClick={() => onJoin?.(session)}
              >
                Join
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
