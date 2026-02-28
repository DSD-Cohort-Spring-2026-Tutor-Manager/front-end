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
  id: string;
  sessionId: string;
  datetimeStarted: string;
  studentFirstName: string;
  studentLastName: string;
  subject: string;
  time: string;
  notes: string;
}

interface Props {
  sessions: Session[];
  type: "upcoming" | "completed";
  onCompleteSession?: (sessionId: string, notes: string) => Promise<void>;
  setSessions?: React.Dispatch<React.SetStateAction<Session[]>>;
}

export default function DataTable({
  sessions,
  type,
  onCompleteSession,
  setSessions,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
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
  const handleConfirm = async (
    sessionId: string,
    rowKey: string,
    session: any,
  ) => {
    setLoadingSessionId(rowKey);

    try {
      const notes = inputValues[rowKey] || "";

      await onCompleteSession?.(sessionId, notes);

      setSessions((prevSessions) => {
        console.log("Previous Sessions:", prevSessions);

        const updatedSessions = prevSessions.map((s) =>
          s.sessionId === sessionId
            ? {
                ...s,
                notes: notes,
                sessionStatus: "completed",
              }
            : s,
        );

        console.log("Updated Sessions:", updatedSessions);

        return updatedSessions;
      });

      setOpenSessionId(null);
      setAnchorEl(null);
    } catch (error) {
      console.error("Failed to complete session:", error);
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
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setOpenSessionId(rowKey);
                              setInputValues((prev) => ({
                                ...prev,
                                [rowKey]: "",
                              }));
                            }}
                          >
                            View
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
                                gap: 1,
                              }}
                            >
                              <TextField
                                size="small"
                                fullWidth
                                autoFocus
                                multiline
                                rows={3}
                                label="Notes"
                                placeholder="Enter session notes..."
                                value={inputValues[rowKey] || ""}
                                onChange={(e) =>
                                  setInputValues((prev) => ({
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
                                    !inputValues[rowKey]?.trim()
                                  }
                                  onClick={() => {
                                    console.log("session", session);
                                    handleConfirm(
                                      session?.sessionId,
                                      rowKey,
                                      session,
                                    );
                                  }}
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
                                    : "Confirm"}
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
