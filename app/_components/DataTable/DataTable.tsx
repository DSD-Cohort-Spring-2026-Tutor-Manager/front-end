import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

interface Session {
  id: string;
  date: string;
  student: string;
  subject: string;
  duration: string;
  time: string;
}

interface Props {
  sessions: Session[];
  type: 'upcoming' | 'completed';
}

export default function DataTable({ sessions, type }: Props) {
  const handleJoin = (id: string) => {
    console.log('Join session:', id);
  };

  const handleCancel = (id: string) => {
    console.log('Cancel session:', id);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Student</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Options</TableCell>
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
            sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.student}</TableCell>
                <TableCell>{session.subject}</TableCell>
                <TableCell>{session.duration}</TableCell>
                <TableCell>{session.time}</TableCell>
                <TableCell>
                  {type === 'upcoming' && (
                    <>
                      <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        sx={{ mr: 1 }}
                        onClick={() => handleJoin(session.id)}
                      >
                        Join
                      </Button>
                      <Button
                        variant='outlined'
                        color='secondary'
                        size='small'
                        onClick={() => handleCancel(session.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {type === 'completed' && (
                    <Button
                      variant='contained'
                      color='success'
                      size='small'
                      onClick={() => console.log('View session:', session.id)}
                    >
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
