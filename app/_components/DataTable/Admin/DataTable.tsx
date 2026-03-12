import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { ParentRecord } from "../../../types/types";

interface Props {
  parentHistory: ParentRecord[];
}

const COLUMNS = ["Parent Name", "No. of Students", "Credits", "Email"];

export default function DataTable({ parentHistory }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedRows = parentHistory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper>
      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {parentHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} align="center">
                  No parents available
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {record.firstName} {record.lastName}
                  </TableCell>
                  <TableCell>{record.numberOfStudents ?? 0}</TableCell>
                  <TableCell>{record.currentCreditAmount ?? 0}</TableCell>
                  <TableCell>{record.email}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {parentHistory.length > 10 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={parentHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          style={{ color: "#595959" }}
        />
      )}
    </Paper>
  );
}
