import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { TutortoiseClient } from "../../../_api/tutortoiseClient";

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
}

interface Props {
  sessions: Session[];
  type: "parent" | "student" | "tutor";
}

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

  const dedupedRows = (() => {
    if (type === "parent") {
      return Array.from(
        new Map(
          sessions.map((s) => [`${s.parentId}-${s.studentId}`, s]),
        ).values(),
      );
    }
    if (type === "tutor") {
      return Array.from(
        new Map(
          sessions.map((s) => [`${s.tutorId}-${s.studentId}`, s]),
        ).values(),
      );
    }
    return Array.from(new Map(sessions.map((s) => [s.studentId, s])).values());
  })();

  const paginatedRows = dedupedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  useEffect(() => {
    const uniqueParentIds = [
      ...new Set(sessions.map((s) => s.parentId).filter(Boolean)),
    ];
    uniqueParentIds.forEach((parentId) => {
      TutortoiseClient.getBalance(parentId).then((balance) => {
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
              {type === "parent" && (
                <>
                  <TableCell>Parent Name</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Credits</TableCell>
                  <TableCell>Status</TableCell>
                </>
              )}
              {type === "tutor" && (
                <>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Subject</TableCell>
                </>
              )}
              {type === "student" && (
                <>
                  <TableCell>Student</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Grade</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {dedupedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No sessions available
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((session) => (
                <TableRow
                  key={
                    type === "parent"
                      ? `${session.parentId}-${session.studentId}`
                      : type === "tutor"
                        ? `${session.tutorId}-${session.studentId}`
                        : session.studentId
                  }
                >
                  {type === "parent" && (
                    <>
                      <TableCell>{session.studentLastName}</TableCell>
                      <TableCell>{session.studentFirstName}</TableCell>
                      <TableCell>
                        {creditBalances[session.parentId] ?? "—"}
                      </TableCell>
                      <TableCell>{session.sessionStatus}</TableCell>
                    </>
                  )}
                  {type === "tutor" && (
                    <>
                      <TableCell>{session.tutorName}</TableCell>
                      <TableCell>{session.subject}</TableCell>
                    </>
                  )}
                  {type === "student" && (
                    <>
                      <TableCell>{session.studentFirstName}</TableCell>
                      <TableCell>{session.studentLastName}</TableCell>
                      <TableCell>{session.tutorName}</TableCell>
                      <TableCell>{session.notes}</TableCell>
                      <TableCell>{session.subject}</TableCell>
                      <TableCell>
                        {String(session.assessmentPointsEarned)}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {dedupedRows.length > 10 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={dedupedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: "#595959" }}
        />
      )}
    </Paper>
  );
}
