'use client';

import { useEffect, useState, useCallback } from 'react';
import { TutortoiseClient } from '../../_api/tutortoiseClient';
import { X } from 'lucide-react';
import './StudentNotePanel.css';

interface StudentNotePanelProps {
  studentId: number;
  studentName: string;
  tutorId: number;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function StudentNotePanel({
  studentId,
  studentName,
  tutorId,
  onClose,
  onSaveSuccess,
}: StudentNotePanelProps) {
  const [notes, setNotes] = useState('');
  const [originalNotes, setOriginalNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    TutortoiseClient.getStudentNote(tutorId, studentId)
      .then((data) => {
        const noteText = data?.notes ?? '';
        setNotes(noteText);
        setOriginalNotes(noteText);
      })
      .catch(() => {
        setNotes('');
        setOriginalNotes('');
      })
      .finally(() => setLoading(false));
  }, [tutorId, studentId]);

  const hasChanges = notes !== originalNotes;

  const handleSave = useCallback(async () => {
    if (!hasChanges || saving) return;
    setSaving(true);
    setSaveMessage(null);

    try {
      const result = await TutortoiseClient.updateStudentNote(
        tutorId,
        studentId,
        notes,
      );
      if (result) {
        setOriginalNotes(notes);
        setSaveMessage('Note saved successfully');
        onSaveSuccess?.();
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      setSaveMessage('Failed to save note');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  }, [hasChanges, saving, tutorId, studentId, notes, onSaveSuccess]);

  const handleCancel = () => {
    setNotes(originalNotes);
    onClose();
  };

  return (
    <div
      className='note-panel'
      role='region'
      aria-label={`Notes for ${studentName}`}
    >
      <div className='note-panel__header'>
        <span className='note-panel__title'>Notes — {studentName}</span>
        <button
          className='note-panel__close-btn'
          onClick={onClose}
          aria-label='Close notes panel'
        >
          <X size={18} />
        </button>
      </div>

      {loading ? (
        <div className='note-panel__loading'>
          <div className='note-panel__spinner' />
          Loading notes…
        </div>
      ) : (
        <>
          <textarea
            id={`student-note-${studentId}`}
            className='note-panel__textarea'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Add notes about this student — topics covered, areas of difficulty, recommendations for next session…'
            aria-label={`Note content for ${studentName}`}
          />

          {saveMessage && (
            <p
              style={{
                marginTop: 8,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: saveMessage.includes('success')
                  ? 'var(--Outlines)'
                  : 'var(--color-error)',
              }}
            >
              {saveMessage}
            </p>
          )}

          <div className='note-panel__actions'>
            <button className='note-panel__cancel-btn' onClick={handleCancel}>
              Cancel
            </button>
            <button
              className='note-panel__save-btn'
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? 'Saving…' : 'Save Note'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
