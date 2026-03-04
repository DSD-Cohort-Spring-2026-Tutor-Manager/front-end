'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { TutortoiseClient } from '../../_api/tutortoiseClient';
import StudentNotesList from '../../_components/StudentNotesList/StudentNotesList';
import StudentNoteModal from '../../_components/StudentNoteModal/StudentNoteModal';
import { Eye, EyeOff, Search } from 'lucide-react';
import './notes.css';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  notes?: string;
  hasActiveBooking?: boolean;
  lastNoteUpdated?: string | null;
}

interface Session {
  id: number;
  studentId: number;
  tutorId?: number;
  status?: string;
  datetimeStarted?: string;
  studentName?: string;
}

export default function TutorNotesPage() {
  const user = useAuthStore((s) => s.user);
  const tutorId =
    typeof user?.id === 'string' ? parseInt(user.id, 10) : (user?.id ?? 0);
  const firstName = user?.name?.split(' ')[0] ?? 'Tutor';

  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnbooked, setShowUnbooked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get tutor's sessions to map student IDs to booking status
        const sessions = (await TutortoiseClient.getSessionHistory()) || [];
        const bookedStudentIds = new Set<number>();

        sessions.forEach((session: Session) => {
          if (session.studentId) {
            bookedStudentIds.add(session.studentId);
          }
        });

        // Get tutor's students from API (or fallback to deriving from sessions)
        let studentList: Student[] = [];

        try {
          const apiStudents = await TutortoiseClient.getTutorStudents(tutorId);
          if (Array.isArray(apiStudents) && apiStudents.length > 0) {
            studentList = apiStudents.map((s: any) => ({
              id: s.id,
              firstName: s.firstName || 'Unknown',
              lastName: s.lastName || 'Student',
              notes: s.notes || '',
              hasActiveBooking: bookedStudentIds.has(s.id),
              lastNoteUpdated:
                s.lastNoteUpdated || s.updatedAt
                  ? new Date(
                      s.lastNoteUpdated || s.updatedAt,
                    ).toLocaleDateString()
                  : null,
            }));
          }
        } catch {
          // If getTutorStudents fails, derive from sessions
          console.warn(
            'getTutorStudents failed, deriving students from sessions',
          );
        }

        // If no students from API, create a list from sessions
        if (studentList.length === 0) {
          const studentMap = new Map<
            number,
            { firstName: string; lastName: string; count: number }
          >();

          sessions.forEach((session: Session) => {
            if (session.studentId && session.studentName) {
              const existing = studentMap.get(session.studentId) || {
                firstName: session.studentName.split(' ')[0],
                lastName: session.studentName.split(' ').slice(1).join(' '),
                count: 0,
              };
              existing.count += 1;
              studentMap.set(session.studentId, existing);
            }
          });

          studentList = Array.from(studentMap.entries()).map(
            ([id, { firstName, lastName }]) => ({
              id,
              firstName,
              lastName,
              notes: '',
              hasActiveBooking: bookedStudentIds.has(id),
              lastNoteUpdated: null,
            }),
          );
        }

        // Sort students by name
        studentList.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`,
          ),
        );

        setStudents(studentList);
      } catch (error) {
        console.error('Error loading tutor data:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    if (tutorId > 0) {
      loadData();
    }
  }, [tutorId]);

  // Filter students based on search query and booking status
  useEffect(() => {
    let result = students;

    // Filter by booking status
    if (!showUnbooked) {
      result = result.filter((s) => s.hasActiveBooking);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
          s.firstName.toLowerCase().includes(query) ||
          s.lastName.toLowerCase().includes(query),
      );
    }

    setFilteredStudents(result);
  }, [students, searchQuery, showUnbooked]);

  const handleSelectStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  }, []);

  const handleSaveSuccess = useCallback(() => {
    // Refresh the student's note
    if (selectedStudent) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id
            ? {
                ...s,
                lastNoteUpdated: new Date().toLocaleDateString(),
              }
            : s,
        ),
      );
    }
  }, [selectedStudent]);

  const bookedCount = students.filter((s) => s.hasActiveBooking).length;
  const unbookedCount = students.length - bookedCount;

  return (
    <div className='notes-page-wrapper'>
      <div className='notes-page'>
        <div className='notes-page__header'>
          <div className='notes-page__page-title'>
            <h1 className='notes-page__title'>{firstName}'s Student Notes</h1>
            <p className='notes-page__subtitle'>
              Manage and track notes for your students to ensure session
              continuity
            </p>
          </div>
          <div className='notes-page__controls'>
            <div className='notes-page__search-wrapper'>
              <Search className='notes-page__search-icon' size={18} />
              <input
                type='text'
                className='notes-page__search-input'
                placeholder='Search students by name…'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label='Search students'
              />
            </div>

            <button
              className={`notes-page__filter-toggle ${
                showUnbooked ? 'notes-page__filter-toggle--active' : ''
              }`}
              onClick={() => setShowUnbooked(!showUnbooked)}
              title={
                showUnbooked ? 'Hide unbooked students' : 'Show all students'
              }
              aria-pressed={showUnbooked}
            >
              {showUnbooked ? <Eye size={18} /> : <EyeOff size={18} />}
              <span className='notes-page__filter-label'>
                {showUnbooked ? 'Showing all' : 'Booked only'}
              </span>
            </button>
          </div>

          <div className='notes-page__stats'>
            <div className='notes-page__stat'>
              <span className='notes-page__stat-label'>Total Students</span>
              <span className='notes-page__stat-value'>{students.length}</span>
            </div>
            <div className='notes-page__stat'>
              <span className='notes-page__stat-label'>
                With Active Bookings
              </span>
              <span className='notes-page__stat-value'>{bookedCount}</span>
            </div>
            {unbookedCount > 0 && (
              <div className='notes-page__stat'>
                <span className='notes-page__stat-label'>
                  Awaiting Bookings
                </span>
                <span className='notes-page__stat-value'>{unbookedCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className='notes-page__content'>
          <StudentNotesList
            students={filteredStudents}
            showUnbooked={showUnbooked}
            onSelectStudent={handleSelectStudent}
            loading={loading}
          />
        </div>
      </div>

      {selectedStudent && (
        <StudentNoteModal
          isOpen={isModalOpen}
          studentId={selectedStudent.id}
          studentName={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
          tutorId={tutorId}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
