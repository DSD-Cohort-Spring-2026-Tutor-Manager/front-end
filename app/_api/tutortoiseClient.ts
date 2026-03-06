import axiosInstance from '@/lib/axios';
import { Parent, Session, Student } from '../types/types';

// Make calls to the same origin to route requests through the proxy
const PARENT_DETAILS_ENDPOINT = '/api/parent/{id}';
const BALANCE_ENDPOINT = '/api/credits/balance/{id}';
const TRANSACTION_HISTORY_ENDPOINT = '/api/credits/history/{id}';
const BUY_CREDITS_ENDPOINT = '/api/credits/buy';
const ADD_STUDENT_ENDPOINT = '/api/student/add';
const ALL_SESSIONS_ENDPOINT = '/api/sessions';
const OPEN_SESSIONS_ENDPOINT = '/api/sessions/open';
const BOOK_SESSION_ENDPOINT =
  '/api/parent/book/{sessionId}/{parentId}/{studentId}';
const ADMIN_ENDPOINT = '/api/admin/dashboard';
const TUTOR_ASSIGN_GRADE_ENDPOINT = '/api/tutor/assign-grade';

export const TutortoiseClient = {
  getBasePath: () => window.location.origin,

  getParentDetails: async (id: number): Promise<Parent> => {
    if (!id || typeof id !== 'number') {
      console.error('Invalid parent ID provided to getParentDetails:', id);
      throw new Error('Invalid parent ID');
    }

    try {
      const response = await axiosInstance.get(
        PARENT_DETAILS_ENDPOINT.replace('{id}', String(id)),
      );
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching parent details:', message);
      throw new Error(
        'Failed to fetch parent details. Please try again later.',
      );
    }
  },

  getBalance: async (id: string): Promise<number> => {
    return await axiosInstance
      .get(BALANCE_ENDPOINT.replace('{id}', id))
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Balance API call failed:', err);
        throw err;
      });
  },

  getOpenSessions: async (): Promise<Session[]> => {
    return await axiosInstance
      .get(OPEN_SESSIONS_ENDPOINT)
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Open sessions API call failed:', err);
        throw err;
      });
  },

  getAllSessions: async (): Promise<Session[]> => {
    return await axiosInstance
      .get(ALL_SESSIONS_ENDPOINT)
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('All sessions API call failed:', err);
        throw err;
      });
  },

  getTransactionHistory: async (id: string): Promise<Session[]> => {
    return await axiosInstance
      .get(TRANSACTION_HISTORY_ENDPOINT.replace('{id}', id))
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Transaction history API call failed:', err);
        throw err;
      });
  },

  buyCredits: async (
    id: string,
    credits: number,
    amount: number,
  ): Promise<number> => {
    return await axiosInstance
      .post(BUY_CREDITS_ENDPOINT, {
        parentId: id,
        credits,
        amount,
      })
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Buy credits API call failed:', err);
        throw err;
      });
  },
  addStudent: async (
    parentId: number,
    firstName: string,
    lastName: string,
  ): Promise<Student> => {
    return await axiosInstance
      .post(ADD_STUDENT_ENDPOINT, {
        parentId,
        firstName,
        lastName,
      })
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Add student API call failed:', err);
        throw err;
      });
  },
  getSessionHistory: async (): Promise<Session[]> => {
    return await axiosInstance
      .get(ALL_SESSIONS_ENDPOINT)
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Session history API call failed:', err);
        throw err;
      });
  },
  bookSession: async (
    parentId: number,
    studentId: number,
    sessionId: number,
  ): Promise<Session> => {
    const updated_endpoint = BOOK_SESSION_ENDPOINT.replace(
      '{sessionId}',
      String(sessionId),
    )
      .replace('{parentId}', String(parentId))
      .replace('{studentId}', String(studentId));
    return await axiosInstance
      .post(updated_endpoint, {
        parentId,
        studentId,
        sessionId,
      })
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Book session API call failed:', err);
        throw err;
      });
  },
  getAdminDetails: async (): Promise<unknown> => {
    return await axiosInstance
      .get(ADMIN_ENDPOINT)
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Admin details API call failed:', err);
        throw err;
      });
  },

  /**
   * Assign a grade to a session and mark it completed (PUT /api/tutor/assign-grade).
   * Backend completes the session and returns the updated session info.
   */
  assignGrade: async (
    tutorId: number,
    sessionId: number,
    grade: number,
  ): Promise<Session> => {
    return await axiosInstance
      .put(TUTOR_ASSIGN_GRADE_ENDPOINT, {
        tutorId,
        sessionId,
        grade,
      })
      .then((res) => res.data)
      .catch((err: unknown) => {
        console.error('Assign grade API call failed:', err);
        throw err;
      });
  },
};
