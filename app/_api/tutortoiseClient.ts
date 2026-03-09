import axiosInstance from "@/lib/axios";

// Make calls to the same origin to route requests through the proxy
const PARENT_DETAILS_ENDPOINT = "/api/parent/{id}";
const BALANCE_ENDPOINT = "/api/credits/balance/{id}";
const TRANSACTION_HISTORY_ENDPOINT = "/api/credits/history/{id}";
const BUY_CREDITS_ENDPOINT = "/api/credits/buy";
const ADD_STUDENT_ENDPOINT = "/api/student/add";
const ALL_SESSIONS_ENDPOINT = "/api/sessions";
const OPEN_SESSIONS_ENDPOINT = "/api/sessions/open";
const BOOK_SESSION_ENDPOINT =
  "/api/parent/book/{sessionId}/{parentId}/{studentId}";
const ADMIN_ENDPOINT = "/api/admin/dashboard";
const TUTOR_ASSIGN_GRADE_ENDPOINT = "/api/tutor/assign-grade";
const STUDENT_NOTE_ENDPOINT = "/api/student/{studentId}/note";
const CREATE_TUTOR_ENDPOINT = "/api/admin/dashboard/createTutor";
const CREATE_PARENT_ENDPOINT = "/api/admin/dashboard/createParent";

export const TutortoiseClient = {
  getBasePath: () => window.location.origin,

  getParentDetails: async (id: number): Promise<any> => {
    return await axiosInstance
      .get(PARENT_DETAILS_ENDPOINT.replace("{id}", String(id)))
      .then((res) => res.data)
      .catch((err) => {
        console.error("Sessions API call failed:", err);
        throw err;
      });
  },

  getBalance: async (id: number): Promise<number> => {
    return await axiosInstance
      .get(BALANCE_ENDPOINT.replace("{id}", String(id)))
      .then((res) => res.data)
      .catch((err) => {
        console.error("Balance API call failed:", err);
        throw err;
      });
  },

  getOpenSessions: async () => {
    return await axiosInstance
      .get(OPEN_SESSIONS_ENDPOINT)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Sessions API call failed:", err);
        throw err;
      });
  },

  getAllSessions: async () => {
    return await axiosInstance
      .get(ALL_SESSIONS_ENDPOINT)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Sessions API call failed:", err);
        throw err;
      });
  },

  getTransactionHistory: async (id: string): Promise<any> => {
    return await axiosInstance
      .get(TRANSACTION_HISTORY_ENDPOINT.replace("{id}", id))
      .then((res) => res.data)
      .catch((err) => {
        console.error("Transaction History API call failed", err);
        throw err;
      });
  },

  buyCredits: async (
    id: string,
    credits: number,
    amount: number,
  ): Promise<any> => {
    return await axiosInstance
      .post(BUY_CREDITS_ENDPOINT, {
        parentId: id,
        credits,
        amount,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Buy credits API call failed", err);
        throw err;
      });
  },
  addStudent: async (
    parentId: number,
    firstName: string,
    lastName: string,
  ): Promise<any> => {
    return await axiosInstance
      .post(ADD_STUDENT_ENDPOINT, {
        parentId,
        firstName,
        lastName,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Add students API call failed", err);
        throw err;
      });
  },
  getSessionHistory: async (): Promise<any> => {
    return await axiosInstance
      .get(ALL_SESSIONS_ENDPOINT)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Transaction History API call failed", err);
        throw err;
      });
  },
  bookSession: async (
    parentId: number,
    studentId: number,
    sessionId: number,
  ): Promise<any> => {
    const updated_endpoint = BOOK_SESSION_ENDPOINT.replace(
      "{sessionId}",
      String(sessionId),
    )
      .replace("{parentId}", String(parentId))
      .replace("{studentId}", String(studentId));
    return await axiosInstance
      .post(updated_endpoint, {
        parentId,
        studentId,
        sessionId,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Book session API call failed", err);
        throw err;
      });
  },
  getAdminDetails: async () => {
    return await axiosInstance
      .get(ADMIN_ENDPOINT)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Sessions API call failed:", err);
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
    grade: number
  ): Promise<any> => {
    return await axiosInstance
      .put(TUTOR_ASSIGN_GRADE_ENDPOINT, {
        tutorId,
        sessionId,
        grade,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error("Assign grade API call failed", err);
        throw err;
      });
  },

  getStudentNote: async (studentId: number, tutorId: number): Promise<any> => {
    return await axiosInstance
      .get(
       STUDENT_NOTE_ENDPOINT.replace("{studentId}", String(studentId)),
        {
          params: { tutorId }, 
        },
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error("Get student note API call failed", err);
        throw err;
      });
  },
  updateStudentNote: async (
    studentId: number,
    tutorId: number,
    firstName: string,
    lastName: string,
    note: string,
  ): Promise<any> => {
    return await axiosInstance
      .put(
       STUDENT_NOTE_ENDPOINT.replace("{studentId}", String(studentId)),
        {
          studentId,
          firstName,
          lastName,
          notes: note,
        },
        {
          params: { tutorId },
        },
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error("Update student note API call failed", err);
        throw err;
      });
  },

  createTutor: async (tutorData: any): Promise<any> => {
    return await axiosInstance
      .post(CREATE_TUTOR_ENDPOINT, tutorData)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Create tutor API call failed", err);
        throw err;
      });
  },

  createParent: async (parentData: any): Promise<any> => {
    return await axiosInstance
      .post(CREATE_PARENT_ENDPOINT, parentData)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Create parent API call failed", err);
        throw err;
      });
  },
};

