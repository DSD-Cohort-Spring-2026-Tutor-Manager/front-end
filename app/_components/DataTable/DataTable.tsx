import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import { Edit as EditIcon } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, TextField, CircularProgress, Typography } from '@mui/material';
import { TutortoiseClient } from '@/app/_api/tutortoiseClient';
import { useAuthStore } from '@/store/authStore';
import Alert from '@/app/_components/Alert/Alert';

const notesCellSx = { maxWidth: 300, width: 300 };
const notesBoxSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  minWidth: 0,
};
const notesTextSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
};
const iconRowSx = {
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: 0.5,
};
const viewBtnSx = { fontSize: '0.65rem', py: 0.2, px: 1, minWidth: 0 };
const editIconSx = { opacity: 0.5, '&:hover': { opacity: 1 } };
const popoverBoxSx = {
  p: 2,
  width: 280,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};
const actionRowSx = { display: 'flex', gap: 1, justifyContent: 'flex-end' };
const centerSx = { display: 'flex', justifyContent: 'center', py: 3 };

interface Session {
  id?: string;
  sessionId: string;
  datetimeStarted: string;
  studentFirstName: string;
  studentLastName: string;
  subject: string;
  time?: string;
  notes?: string;
  tutorId?: number;
  studentId?: number;
  tutorName?: string;
}

interface Props {
  sessions: Session[];
  type: 'upcoming' | 'completed';
  onAssignGrade?: (sessionId: string | number, grade: number) => Promise<void>;
  onNoteSaved?: () => void;
}

export default function DataTable({
  sessions,
  type,
  onAssignGrade,
  onNoteSaved,
}: Props) {
  const user = useAuthStore((s: any) => s.user);
  const tutorId = user?.id;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [gradeValues, setGradeValues] = useState<Record<string, string>>({});
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [notesDialog, setNotesDialog] = useState(false);
  const [notesSession, setNotesSession] = useState<Session | null>(null);
  const [existingNotes, setExistingNotes] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [notesFetching, setNotesFetching] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesError, setNotesError] = useState('');
  const [notesSuccess, setNotesSuccess] = useState(false);
  const [viewNotesSession, setViewNotesSession] = useState<Session | null>(
    null,
  );
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertExiting, setIsAlertExiting] = useState(false);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const showSuccessAlert = () => {
    setIsAlertExiting(false);
    setIsAlertVisible(true);
  };

  const paginatedSessions = sessions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleGradeSubmit = async (
    sessionId: string | number,
    rowKey: string,
  ) => {
    const raw = gradeValues[rowKey]?.trim();
    const grade = raw === '' ? NaN : parseFloat(raw);
    if (Number.isNaN(grade) || grade < 0 || grade > 100) return;
    setLoadingSessionId(rowKey);
    try {
      await onAssignGrade?.(sessionId, grade);
      setOpenSessionId(null);
      setAnchorEl(null);
      showSuccessAlert();
    } catch (error) {
      console.error('Failed to assign grade:', error);
    } finally {
      setLoadingSessionId(null);
    }
  };

  const handleOpenNotes = async (session: Session) => {
    setNotesSession(session);
    setExistingNotes(session.notes || '');
    setEditedNotes(session.notes || '');
    setNotesError('');
    setNotesSuccess(false);
    setNotesDialog(true);
    if (!session.studentId) return;

    setNotesFetching(true);
    try {
      const data = await TutortoiseClient.getStudentNote(
        Number(session.studentId),
        tutorId,
      );
      const fetched = data?.notes || session.notes || '';
      setExistingNotes(fetched);
      setEditedNotes(fetched);
    } catch {
      // fall back to session.notes
    } finally {
      setNotesFetching(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!notesSession || !editedNotes.trim()) return;
    setNotesSaving(true);
    setNotesError('');
    setNotesSuccess(false);
    try {
      await TutortoiseClient.updateStudentNote(
        Number(notesSession.studentId),
        tutorId,
        notesSession.studentFirstName,
        notesSession.studentLastName,
        editedNotes.trim(),
      );
      setExistingNotes(editedNotes.trim());
      setNotesSuccess(true);
      setNotesDialog(false);
      onNoteSaved?.();
    } catch (error: any) {
      setNotesError(error?.message || 'Could not save note. Please try again.');
    } finally {
      setNotesSaving(false);
    }
  };

  const handleClose = () => {
    setOpenSessionId(null);
    setAnchorEl(null);
  };

  const isGradeInvalid = (rowKey: string) => {
    const v = gradeValues[rowKey]?.trim();
    const n = v === '' ? NaN : parseFloat(v);
    return Number.isNaN(n) || n < 0 || n > 100;
  };

  useEffect(() => {
    if (!isAlertVisible) return;

    const stayTimer = setTimeout(() => {
      setIsAlertExiting(true);
    }, 5000);

    const removeTimer = setTimeout(() => {
      setIsAlertVisible(false);
      setIsAlertExiting(false);
    }, 5400);

    return () => {
      clearTimeout(stayTimer);
      clearTimeout(removeTimer);
    };
  }, [isAlertVisible]);

  return (
    <>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Time</TableCell>
                <TableCell sx={notesCellSx}>Notes</TableCell>
                {type === 'upcoming' && <TableCell>Options</TableCell>}
              </TableRow>
            </TableHead>

            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    No sessions available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSessions.map((session, index) => {
                  const rowKey = session.sessionId ?? `row-${index}`;
                  return (
                    <TableRow key={rowKey}>
                      <TableCell>
                        {session.datetimeStarted?.split('T')[0]}
                      </TableCell>
                      <TableCell>
                        {session.studentFirstName} {session.studentLastName}
                      </TableCell>
                      <TableCell>{session.subject}</TableCell>
                      <TableCell>
                        {session.datetimeStarted?.split('T')[1].slice(0, 5)}
                      </TableCell>

                      <TableCell sx={notesCellSx}>
                        <Box sx={notesBoxSx}>
                          <Typography variant='body2' sx={notesTextSx}>
                            {session.notes || '—'}
                          </Typography>
                          <Box sx={iconRowSx}>
                            {session.notes && session.notes.length > 50 && (
                              <Button
                                size='small'
                                variant='outlined'
                                color='success'
                                sx={viewBtnSx}
                                onClick={() => setViewNotesSession(session)}
                              >
                                View
                              </Button>
                            )}
                            {type === 'upcoming' && (
                              <IconButton
                                size='small'
                                onClick={() => handleOpenNotes(session)}
                                sx={editIconSx}
                                aria-label='Edit notes'
                              >
                                <EditIcon fontSize='inherit' />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {type === 'upcoming' && (
                          <>
                            <Button
                              variant='contained'
                              color='success'
                              size='small'
                              onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                setOpenSessionId(rowKey);
                                setGradeValues((prev) => ({
                                  ...prev,
                                  [rowKey]: '',
                                }));
                              }}
                            >
                              Grade
                            </Button>

                            <Popover
                              open={openSessionId === rowKey}
                              anchorEl={anchorEl}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                              }}
                            >
                              <Box sx={popoverBoxSx}>
                                <TextField
                                  size='small'
                                  fullWidth
                                  autoFocus
                                  type='number'
                                  inputProps={{ min: 0, max: 100, step: 1 }}
                                  label='Grade (0–100)'
                                  placeholder='e.g. 85'
                                  value={gradeValues[rowKey] || ''}
                                  onChange={(e) =>
                                    setGradeValues((prev) => ({
                                      ...prev,
                                      [rowKey]: e.target.value,
                                    }))
                                  }
                                />
                                <Box sx={actionRowSx}>
                                  <Button
                                    variant='outlined'
                                    color='inherit'
                                    size='small'
                                    disabled={loadingSessionId === rowKey}
                                    onClick={handleClose}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant='contained'
                                    color='primary'
                                    size='small'
                                    disabled={
                                      loadingSessionId === rowKey ||
                                      isGradeInvalid(rowKey)
                                    }
                                    onClick={() =>
                                      handleGradeSubmit(
                                        session?.sessionId,
                                        rowKey,
                                      )
                                    }
                                    startIcon={
                                      loadingSessionId === rowKey ? (
                                        <CircularProgress
                                          size={14}
                                          color='inherit'
                                        />
                                      ) : null
                                    }
                                  >
                                    {loadingSessionId === rowKey
                                      ? 'Saving...'
                                      : 'Assign grade'}
                                  </Button>
                                </Box>
                              </Box>
                            </Popover>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {sessions.length > 10 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component='div'
            count={sessions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      <Dialog
        open={notesDialog}
        onClose={() => setNotesDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          Edit Notes
          {notesSession && (
            <Typography variant='body2' color='text.secondary'>
              {notesSession.studentFirstName} {notesSession.studentLastName} —{' '}
              {notesSession.subject}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {notesFetching ? (
            <Box sx={centerSx}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={5}
              size='small'
              label='Notes'
              value={editedNotes}
              onChange={(e) => {
                setEditedNotes(e.target.value);
                setNotesSuccess(false);
              }}
            />
          )}
          {notesError && (
            <Typography
              variant='caption'
              color='error'
              sx={{ mt: 1, display: 'block' }}
            >
              {notesError}
            </Typography>
          )}
          {notesSuccess && (
            <Typography
              variant='caption'
              color='success.main'
              sx={{ mt: 1, display: 'block' }}
            >
              Notes saved successfully.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            color='inherit'
            onClick={() => setNotesDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={
              notesSaving ||
              !editedNotes.trim() ||
              editedNotes === existingNotes
            }
            onClick={handleSaveNotes}
            startIcon={
              notesSaving ? (
                <CircularProgress size={14} color='inherit' />
              ) : null
            }
          >
            {notesSaving ? 'Saving...' : 'Save Notes'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!viewNotesSession}
        onClose={() => setViewNotesSession(null)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          Full Notes
          {viewNotesSession && (
            <Typography variant='body2' color='text.secondary'>
              {viewNotesSession.studentFirstName}{' '}
              {viewNotesSession.studentLastName} — {viewNotesSession.subject}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
            {viewNotesSession?.notes || '—'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            color='inherit'
            onClick={() => setViewNotesSession(null)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div className='alert-layer'>
        {isAlertVisible && (
          <Alert
            type='success'
            text='Grade assigned and session completed successfully!'
            className={isAlertExiting ? 'alert-exit' : 'alert-enter'}
          />
        )}
      </div>
    </>
  );
}
