import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, ExpandLess, ExpandMore } from "@mui/icons-material";
import { TutortoiseClient } from "@/app/_api/tutortoiseClient";
import { useAuthStore } from "@/store/authStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id?: string;
  sessionId: string;
  datetimeStarted: string;
  studentFirstName: string;
  studentLastName: string;
  subject: string;
  notes?: string;
  tutorId?: number;
  studentId?: number;
  tutorName?: string;
}

interface Props {
  sessions: Session[];
  type: "upcoming" | "completed";
  onAssignGrade?: (sessionId: string | number, grade: number) => Promise<void>;
  setSessions?: React.Dispatch<React.SetStateAction<Session[]>>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return iso?.split("T")[1]?.slice(0, 5) ?? "";
}

function isGradeStringInvalid(value: string) {
  const n = value.trim() === "" ? NaN : parseInt(value, 10);
  return Number.isNaN(n) || n < 0 || n > 100;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NotesCell({
  session,
  type,
  onEdit,
  onView,
}: {
  session: Session;
  type: Props["type"];
  onEdit: (s: Session) => void;
  onView: (s: Session) => void;
}) {
  const hasLongNotes = (session.notes?.length ?? 0) > 50;
  return (
    <Box className="notesCell">
      <Typography
        variant="body2"
        className={`notesText${!session.notes ? " notesEmpty" : ""}`}
      >
        {session.notes || "No notes"}
      </Typography>
      <Box className="notesActions">
        {hasLongNotes && (
          <Button
            size="small"
            variant="outlined"
            color="success"
            className="viewBtn"
            onClick={() => onView(session)}
          >
            View
          </Button>
        )}
        {type === "upcoming" && (
          <IconButton
            size="small"
            onClick={() => onEdit(session)}
            className="editIcon"
            aria-label="Edit notes"
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

function GradePopover({
  rowKey,
  sessionId,
  anchorEl,
  gradeValues,
  loadingSessionId,
  onGradeChange,
  onSubmit,
  onClose,
}: {
  rowKey: string;
  sessionId: string;
  anchorEl: HTMLElement | null;
  gradeValues: Record<string, string>;
  loadingSessionId: string | null;
  onGradeChange: (rowKey: string, val: string) => void;
  onSubmit: (sessionId: string, rowKey: string) => void;
  onClose: () => void;
}) {
  const isLoading = loadingSessionId === rowKey;
  const isInvalid = isGradeStringInvalid(gradeValues[rowKey] ?? "");

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Box className="popover">
        <TextField
          size="small"
          fullWidth
          autoFocus
          type="number"
          inputProps={{ min: 0, max: 100, step: 1 }}
          label="Grade (0–100)"
          placeholder="e.g. 85"
          value={gradeValues[rowKey] ?? ""}
          onChange={(e) => onGradeChange(rowKey, e.target.value)}
        />
        <Box className="popoverActions">
          <Button variant="outlined" color="inherit" size="small" disabled={isLoading} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={isLoading || isInvalid}
            onClick={() => onSubmit(sessionId, rowKey)}
            startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}
          >
            {isLoading ? "Saving..." : "Assign grade"}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

function NotesDialog({
  open,
  session,
  editedNotes,
  existingNotes,
  isFetching,
  isSaving,
  error,
  success,
  onChange,
  onSave,
  onClose,
}: {
  open: boolean;
  session: Session | null;
  editedNotes: string;
  existingNotes: string;
  isFetching: boolean;
  isSaving: boolean;
  error: string;
  success: boolean;
  onChange: (val: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const unchanged = editedNotes === existingNotes;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit Notes
        {session && (
          <Typography variant="body2" color="text.secondary">
            {session.studentFirstName} {session.studentLastName} — {session.subject}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {isFetching ? (
          <Box className="center">
            <CircularProgress size={24} />
          </Box>
        ) : (
          <TextField
            fullWidth
            multiline
            rows={5}
            size="small"
            label="Notes"
            value={editedNotes}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {error   && <Typography variant="caption" color="error"        className="feedbackText">{error}</Typography>}
        {success && <Typography variant="caption" color="success.main" className="feedbackText">Notes saved successfully.</Typography>}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isSaving || !editedNotes.trim() || unchanged}
          onClick={onSave}
          startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : null}
        >
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ViewNotesDialog({
  session,
  onClose,
}: {
  session: Session | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(session)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Full Notes
        {session && (
          <Typography variant="body2" color="text.secondary">
            {session.studentFirstName} {session.studentLastName} — {session.subject}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" className="preWrap">
          {session?.notes || "—"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Subject Group ────────────────────────────────────────────────────────────

function SubjectGroup({
  subject,
  sessions,
  type,
  sharedGradeProps,
  onOpenNotes,
  onViewNotes,
}: {
  subject: string;
  sessions: Session[];
  type: Props["type"];
  sharedGradeProps: {
    gradeValues: Record<string, string>;
    setGradeValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    openRowKey: string | null;
    setOpenRowKey: React.Dispatch<React.SetStateAction<string | null>>;
    anchorEl: HTMLElement | null;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    loadingSessionId: string | null;
    setLoadingSessionId: React.Dispatch<React.SetStateAction<string | null>>;
    onAssignGrade?: Props["onAssignGrade"];
  };
  onOpenNotes: (s: Session) => void;
  onViewNotes: (s: Session) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const { gradeValues, setGradeValues, openRowKey, setOpenRowKey, anchorEl, setAnchorEl, loadingSessionId, setLoadingSessionId, onAssignGrade } = sharedGradeProps;
  const colSpan = type === "upcoming" ? 4 : 3;

  const handleGradeSubmit = async (sessionId: string, rowKey: string) => {
    const n = parseInt(gradeValues[rowKey]?.trim(), 10);
    if (Number.isNaN(n) || n < 0 || n > 100) return;
    setLoadingSessionId(rowKey);
    try {
      await onAssignGrade?.(sessionId, n);
      setOpenRowKey(null);
      setAnchorEl(null);
    } catch (err) {
      console.error("Failed to assign grade:", err);
    } finally {
      setLoadingSessionId(null);
    }
  };

  const closeGrade = () => { setOpenRowKey(null); setAnchorEl(null); };

  return (
    <>
      {/* Subject header */}
      <TableRow className="subjectHeader" onClick={() => setExpanded((v) => !v)}>
        <TableCell colSpan={colSpan}>
          <Box className="subjectHeaderContent">
            {expanded ? <ExpandLess fontSize="small" className="subjectChevron" /> : <ExpandMore fontSize="small" className="subjectChevron" />}
            <Typography className="subjectLabel">{subject}</Typography>
            <Chip
              size="small"
              label={`${sessions.length} session${sessions.length !== 1 ? "s" : ""}`}
              className="sessionChip"
            />
          </Box>
        </TableCell>
      </TableRow>

      {/* Session rows */}
      {expanded && sessions.map((session, index) => {
        const rowKey = session.id ?? `${subject}-${index}`;
        const isThisOpen = openRowKey === rowKey;

        return (
          <TableRow key={rowKey} className="sessionRow">
            <TableCell className="colDate">
              <Typography className="dateMain">{formatDate(session.datetimeStarted)}</Typography>
              <Typography className="dateTime">{formatTime(session.datetimeStarted)}</Typography>
            </TableCell>

            <TableCell className="colTutor">
              <Typography className="tutorName">{session.tutorName ?? "—"}</Typography>
            </TableCell>

            <TableCell className="colNotes notesTd">
              <NotesCell session={session} type={type} onEdit={onOpenNotes} onView={onViewNotes} />
            </TableCell>

            {type === "upcoming" && (
              <TableCell>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setOpenRowKey(rowKey);
                    setGradeValues((prev) => ({ ...prev, [rowKey]: "" }));
                  }}
                >
                  Grade
                </Button>
                {isThisOpen && (
                  <GradePopover
                    rowKey={rowKey}
                    sessionId={session.sessionId}
                    anchorEl={anchorEl}
                    gradeValues={gradeValues}
                    loadingSessionId={loadingSessionId}
                    onGradeChange={(key, val) => setGradeValues((prev) => ({ ...prev, [key]: val }))}
                    onSubmit={handleGradeSubmit}
                    onClose={closeGrade}
                  />
                )}
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function DataTable({ sessions, type, onAssignGrade }: Props) {
  const tutorId = useAuthStore((s: any) => s.user?.id);

  // Pagination
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Grade popover
  const [gradeValues, setGradeValues]           = useState<Record<string, string>>({});
  const [openRowKey, setOpenRowKey]             = useState<string | null>(null);
  const [anchorEl, setAnchorEl]                 = useState<HTMLElement | null>(null);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  // Notes edit dialog
  const [notesDialog, setNotesDialog]   = useState(false);
  const [notesSession, setNotesSession] = useState<Session | null>(null);
  const [existingNotes, setExistingNotes] = useState("");
  const [editedNotes, setEditedNotes]     = useState("");
  const [notesFetching, setNotesFetching] = useState(false);
  const [notesSaving, setNotesSaving]     = useState(false);
  const [notesError, setNotesError]       = useState("");
  const [notesSuccess, setNotesSuccess]   = useState(false);

  // Notes view dialog
  const [viewNotesSession, setViewNotesSession] = useState<Session | null>(null);

  // Group + paginate
  const paginated = sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const grouped = useMemo(() => {
    const map = new Map<string, Session[]>();
    [...sessions]
      .sort((a, b) => new Date(b.datetimeStarted).getTime() - new Date(a.datetimeStarted).getTime())
      .forEach((s) => {
        const key = s.subject || "Other";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(s);
      });
    return map;
  }, [sessions]);

  const paginatedSubjectSet = useMemo(
    () => new Set(paginated.map((s) => s.subject || "Other")),
    [paginated]
  );

  const handleOpenNotes = async (session: Session) => {
    setNotesSession(session);
    setExistingNotes(session.notes ?? "");
    setEditedNotes(session.notes ?? "");
    setNotesError("");
    setNotesSuccess(false);
    setNotesDialog(true);
    if (!session.studentId) return;

    setNotesFetching(true);
    try {
      const data    = await TutortoiseClient.getStudentNote(Number(session.studentId), tutorId);
      const fetched = data?.notes || data?.lastName || session.notes || "";
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
    setNotesError("");
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
      window.location.reload();
    } catch (err: any) {
      setNotesError(err?.message || "Could not save note. Please try again.");
    } finally {
      setNotesSaving(false);
    }
  };

  const sharedGradeProps = {
    gradeValues, setGradeValues,
    openRowKey, setOpenRowKey,
    anchorEl, setAnchorEl,
    loadingSessionId, setLoadingSessionId,
    onAssignGrade,
  };

  return (
    <>
      <Paper elevation={0} className="tableWrapper">
        <TableContainer>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell className="colDate">Date</TableCell>
                <TableCell className="colTutor">Tutor</TableCell>
                <TableCell className="colNotes">Notes</TableCell>
                {type === "upcoming" && <TableCell className="colOptions">Options</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={type === "upcoming" ? 4 : 3} className="emptyCell">
                    No sessions available
                  </TableCell>
                </TableRow>
              ) : (
                Array.from(grouped.entries())
                  .filter(([subject]) => paginatedSubjectSet.has(subject))
                  .map(([subject, subjectSessions]) => (
                    <SubjectGroup
                      key={subject}
                      subject={subject}
                      sessions={subjectSessions.filter((s) => paginated.includes(s))}
                      type={type}
                      sharedGradeProps={sharedGradeProps}
                      onOpenNotes={handleOpenNotes}
                      onViewNotes={setViewNotesSession}
                    />
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {sessions.length > 10 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={sessions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        )}
      </Paper>

      <NotesDialog
        open={notesDialog}
        session={notesSession}
        editedNotes={editedNotes}
        existingNotes={existingNotes}
        isFetching={notesFetching}
        isSaving={notesSaving}
        error={notesError}
        success={notesSuccess}
        onChange={(val) => { setEditedNotes(val); setNotesSuccess(false); }}
        onSave={handleSaveNotes}
        onClose={() => setNotesDialog(false)}
      />

      <ViewNotesDialog session={viewNotesSession} onClose={() => setViewNotesSession(null)} />
    </>
  );
}