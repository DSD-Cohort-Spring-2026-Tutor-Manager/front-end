'use client';

import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import './BookedSessionsTable.css';

type SessionRow = {
  id: number | string;
  date: string;
  tutor: string;
  subject: string;
  time: string;
};

type BookedSessionsTableProps = {
  sessions?: SessionRow[];
  loading?: boolean;
  onFindTutor?: () => void;
};

const INITIAL_VISIBLE = 5;
const PAGE_SIZE = 10;

export default function BookedSessionsTable({
  sessions = [],
  loading = false,
  onFindTutor,
}: BookedSessionsTableProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const visibleSessions = sessions.slice(0, visibleCount);
  const hasMore = visibleCount < sessions.length;

  return (
    <section className='booked-table'>
      <div className='booked-table__header'>
        <h2 className='booked-table__title'>Tutoring Schedule</h2>
        <button
          type='button'
          className='booked-table__find-btn'
          onClick={() => onFindTutor?.()}
        >
          Find a tutor
        </button>
      </div>

      <div className='booked-table__divider' />

      <div className='booked-table__labels' aria-hidden='true'>
        <span>Date</span>
        <span>Tutor</span>
        <span>Subject</span>
        <span>Time</span>
      </div>

      {loading ? (
        <Box className='booked-table__loading'>
          <CircularProgress color='success' size={32} />
          <Typography variant='body2' color='text.disabled'>
            Loading sessions…
          </Typography>
        </Box>
      ) : sessions.length === 0 ? (
        <p className='booked-table__empty'>No sessions booked.</p>
      ) : (
        <>
          <ul className='booked-table__list'>
            {visibleSessions.map((session) => (
              <li key={session.id} className='booked-table__row'>
                <span className='booked-table__cell'>{session.date}</span>
                <span className='booked-table__cell'>{session.tutor}</span>
                <span className='booked-table__cell'>{session.subject}</span>
                <span className='booked-table__cell'>{session.time}</span>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className='booked-table__view-more'>
              <button
                type='button'
                className='booked-table__view-more-btn'
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                View More
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
