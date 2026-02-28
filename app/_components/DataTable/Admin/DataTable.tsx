import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";

interface Session {
  id: string;
  datetimeStarted: string;
  studentFirstName: string;
  subject: string;
  time: string;
}

interface Props {
  sessions: Session[];
  type: "parent" | "student" | "tutor";
}

export default function DataTable({ sessions, type }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedSessions = sessions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper>
      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {type === "parent" && (
                <>
                  <TableCell>Parent</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Credits</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Options</TableCell>
                </>
              )}
              {type === "tutor" && (
                <>
                  <TableCell>Date</TableCell>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Upcoming Session</TableCell>
                  <TableCell>Today Session</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Options</TableCell>
                </>
              )}
              {type === "student" && (
                <>
                  <TableCell>Student</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Options</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell colSpan={6} align="center">
                No sessions available
              </TableCell>
            </TableRow>
            {/* {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No sessions available
                </TableCell>
              </TableRow>
            ) : (
              paginatedSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    {session.datetimeStarted?.split("T")[0]}
                  </TableCell>
                  <TableCell>{session.studentFirstName}</TableCell>
                  <TableCell>{session.subject}</TableCell>
                  <TableCell>
                    {session.datetimeStarted?.split("T")[1]}
                  </TableCell>
                  <TableCell>
                    {type === "upcoming" && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => console.log("View session:", session.id)}
                      >
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )} */}
          </TableBody>
        </Table>
      </TableContainer>

      {/* {sessions.length > 10 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={sessions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: "#595959" }}
        />
      )} */}
    </Paper>
  );
}
