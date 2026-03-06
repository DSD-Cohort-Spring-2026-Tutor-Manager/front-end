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
import Popover from "@mui/material/Popover";
import { Box, TextField, CircularProgress } from "@mui/material";

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
}

interface Props {
  sessions: Session[];
  type: "upcoming" | "completed";
  onAssignGrade?: (sessionId: string | number, grade: number) => Promise<void>;
  setSessions?: React.Dispatch<React.SetStateAction<Session[]>>;
}

export default function DataTable({
  sessions,
  type,
  onAssignGrade,
  setSessions,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [gradeValues, setGradeValues] = useState<Record<string, string>>({});
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
  const handleGradeSubmit = async (
    sessionId: string | number,
    rowKey: string,
  ) => {
    const raw = gradeValues[rowKey]?.trim();
    const grade = raw === "" ? NaN : parseInt(raw, 10);
    if (Number.isNaN(grade) || grade < 0 || grade > 100) {
      return;
    }
    setLoadingSessionId(rowKey);
    try {
      await onAssignGrade?.(sessionId, grade);
      setOpenSessionId(null);
      setAnchorEl(null);
    } catch (error) {
      console.error("Failed to assign grade:", error);
    } finally {
      setLoadingSessionId(null);
    }
  };
  const handleClose = () => {
    setOpenSessionId(null);
    setAnchorEl(null);
  };

  return (
    <Paper>
      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Notes</TableCell>
              {type === "upcoming" && <TableCell>Options</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No sessions available
                </TableCell>
              </TableRow>
            ) : (
              paginatedSessions.map((session, index) => {
                const rowKey = session.id ?? `row-${index}`;

                return (
                  <TableRow key={rowKey}>
                    <TableCell>
                      {session.datetimeStarted?.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      {session.studentFirstName + " " + session.studentLastName}
                    </TableCell>
                    <TableCell>{session.subject}</TableCell>
                    <TableCell>
                      {session.datetimeStarted?.split("T")[1]}
                    </TableCell>
                    <TableCell>{session.notes || "—"}</TableCell>
                    <TableCell>
                      {type === "upcoming" && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              setAnchorEl(e.currentTarget);
                              setOpenSessionId(rowKey);
                              setGradeValues((prev: Record<string, string>) => ({
                                ...prev,
                                [rowKey]: "",
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
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <Box
                              sx={{
                                p: 2,
                                width: 280,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5,
                              }}
                            >
                              <TextField
                                size="small"
                                fullWidth
                                autoFocus
                                type="number"
                                inputProps={{
                                  min: 0,
                                  max: 100,
                                  step: 1,
                                }}
                                label="Grade (0–100)"
                                placeholder="e.g. 85"
                                value={gradeValues[rowKey] || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setGradeValues((prev: Record<string, string>) => ({
                                    ...prev,
                                    [rowKey]: e.target.value,
                                  }))
                                }
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  color="inherit"
                                  size="small"
                                  disabled={loadingSessionId === rowKey}
                                  onClick={handleClose}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  disabled={
                                    loadingSessionId === rowKey ||
                                    (() => {
                                      const v = gradeValues[rowKey]?.trim();
                                      const n = v === "" ? NaN : parseInt(v, 10);
                                      return (
                                        Number.isNaN(n) || n < 0 || n > 100
                                      );
                                    })()
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
                                        color="inherit"
                                      />
                                    ) : null
                                  }
                                >
                                  {loadingSessionId === rowKey
                                    ? "Saving..."
                                    : "Assign grade"}
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
          component="div"
          count={sessions.length}
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
