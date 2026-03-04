'use client';

import { useMemo } from 'react';
import { FileText, Clock } from 'lucide-react';
import './StudentNotesList.css';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  notes?: string;
  hasActiveBooking?: boolean;
  lastNoteUpdated?: string | null;
}

interface StudentNotesListProps {
  students: Student[];
  showUnbooked?: boolean;
  onSelectStudent: (student: Student) => void;
  loading?: boolean;
}

export default function StudentNotesList({
  students,
  showUnbooked = true,
  onSelectStudent,
  loading = false,
}: StudentNotesListProps) {
  const filteredStudents = useMemo(() => {
    return students.filter((s) => showUnbooked || s.hasActiveBooking);
  }, [students, showUnbooked]);

  if (loading) {
    return (
      <div className='student-notes-list student-notes-list--loading'>
        <div className='student-notes-list__spinner' />
        <p>Loading students…</p>
      </div>
    );
  }

  if (filteredStudents.length === 0) {
    return (
      <div className='student-notes-list student-notes-list--empty'>
        <div className='student-notes-list__empty-icon'>
          <FileText size={48} />
        </div>
        <h3 className='student-notes-list__empty-title'>
          {showUnbooked
            ? 'No students yet'
            : 'No students with active bookings'}
        </h3>
        <p className='student-notes-list__empty-text'>
          {showUnbooked
            ? 'Students you work with will appear here'
            : 'Book sessions to see students with active bookings'}
        </p>
      </div>
    );
  }

  return (
    <div className='student-notes-list'>
      {filteredStudents.map((student) => (
        <div
          key={student.id}
          className='student-notes-list__item'
          onClick={() => onSelectStudent(student)}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectStudent(student);
            }
          }}
        >
          <div className='student-notes-list__item-header'>
            <div className='student-notes-list__item-info'>
              <h3 className='student-notes-list__item-name'>
                {student.firstName} {student.lastName}
              </h3>
              <div className='student-notes-list__item-meta'>
                {student.lastNoteUpdated && (
                  <div className='student-notes-list__item-timestamp'>
                    <Clock size={14} />
                    <span>Last updated: {student.lastNoteUpdated}</span>
                  </div>
                )}
              </div>
            </div>
            <div className='student-notes-list__item-badges'>
              {student.hasActiveBooking ? (
                <span
                  className='student-notes-list__badge student-notes-list__badge--booked'
                  title='Has active booking'
                >
                  Booked
                </span>
              ) : (
                <span
                  className='student-notes-list__badge student-notes-list__badge--unbooked'
                  title='No active booking'
                >
                  Unbooked
                </span>
              )}
            </div>
          </div>
          {student.notes && (
            <div className='student-notes-list__item-preview'>
              <p className='student-notes-list__item-preview-text'>
                {student.notes.length > 100
                  ? `${student.notes.substring(0, 100)}…`
                  : student.notes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
