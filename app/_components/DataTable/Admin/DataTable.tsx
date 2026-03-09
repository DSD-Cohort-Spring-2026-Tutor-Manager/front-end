import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { TutortoiseClient } from '../../../_api/tutortoiseClient';

interface Session {
  id: string;
  datetimeStarted: string;
  studentFirstName: string;
  studentLastName: string;
  studentId: string;
  subject: string;
  time: string;
  sessionStatus: string;
  tutorName: string;
  tutorId: string;
  notes: string;
  parentId: string;
  assessmentPointsEarned: BigInteger;
  status: string;
}

interface Props {
  sessions: Session[];
  type: 'parent' | 'student' | 'tutor';
}

const COLUMN_CONFIGS: Record<string, string[]> = {
  parent: ["Parent Name", "Student Name", "Credits"],
  tutor: ["Tutor", "Subject"],
  student: ["Student", "Parent", "Tutor", "Subject", "Grade"],
};

export default function DataTable({ sessions, type }: Props) {
  const [page, setPage] = useState(0);
  const [creditBalances, setCreditBalances] = useState<Record<string, number>>(
    {},
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
const STATUS_PRIORITY: Record<string, number> = {
  cancelled: 0,
  open: 1,
  scheduled: 2,
  completed: 3,
};

const dedupedRows = (() => {
  const groupedMap = new Map<string, Session[]>();

  sessions.forEach((s) => {
    let key: string;
    if (type === "parent") key = `${s.parentId}-${s.studentId}`;
    else if (type === "tutor") key = `${s.tutorId}-${s.studentId}`;
    else key = String(s.studentId);

    if (!groupedMap.has(key)) groupedMap.set(key, []);
    groupedMap.get(key)!.push(s);
  });

  return Array.from(groupedMap.values()).map((group) => {
    return group.reduce((best, current) => {
      const bestPriority = STATUS_PRIORITY[best.sessionStatus?.toLowerCase()] ?? 0;
      const currentPriority = STATUS_PRIORITY[current.sessionStatus?.toLowerCase()] ?? 0;
      return currentPriority > bestPriority ? current : best;
    });
  });
})();

  const getRowKey = (session: Session): string => {
    if (type === 'parent') return `${session.parentId}-${session.studentId}`;
    if (type === 'tutor') return `${session.tutorId}-${session.studentId}`;
    return session.studentId;
  };
  
  const paginatedRows = dedupedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const renderCells = (session: Session) => {
    if (type === 'parent') {
      return (
        <>
          <TableCell>{session.studentLastName}</TableCell>
          <TableCell>{session.studentFirstName}</TableCell>
          <TableCell>{creditBalances[session.parentId] ?? "—"}</TableCell>
          
        </>
      );
    }
    if (type === 'tutor') {
      return (
        <>
          <TableCell>{session.tutorName}</TableCell>
          <TableCell>{session.subject}</TableCell>
        </>
      );
    }
    return (
      <>
        <TableCell>{session.studentFirstName}</TableCell>
        <TableCell>{session.studentLastName}</TableCell>
        <TableCell>{session.tutorName}</TableCell>
        <TableCell>{session.subject}</TableCell>
        <TableCell>{session.assessmentPointsEarned}</TableCell>
       
      </>
    );
  };
  useEffect(() => {
    const uniqueParentIds = [
      ...new Set(sessions.map((s) => s.parentId).filter(Boolean)),
    ];
    uniqueParentIds.forEach((parentId) => {
      TutortoiseClient.getBalance(Number(parentId)).then((balance) => {
        setCreditBalances((prev) => ({ ...prev, [parentId]: balance }));
      });
    });
  }, [sessions]);

  return (
    <Paper>
      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {COLUMN_CONFIGS[type].map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {dedupedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMN_CONFIGS[type].length} align='center'>
                  No sessions available
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((session) => (
                <TableRow key={getRowKey(session)}>
                  {renderCells(session)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {dedupedRows.length > 10 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          count={dedupedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: '#595959' }}
        />
      )}
    </Paper>
  );
}
