// Make calls to the same origin to route requests through the proxy
const PARENT_DETAILS_ENDPOINT = "/api/parent/{id}";
const BALANCE_ENDPOINT = "/api/credits/balance/{id}";
const TRANSACTION_HISTORY_ENDPOINT = "/api/credits/history/{id}";
const BUY_CREDITS_ENDPOINT = "/api/credits/buy";
const ADD_STUDENT_ENDPOINT = "/api/student/add";
const VIEW_SESSIONS_ENDPOINT = "/api/sessions";
const BOOK_SESSION_ENDPOINT = "/api/session/book"

export const TutortoiseClient = {
  getBasePath: () => window.location.origin,

  getParentDetails: async (id: number): Promise<any> => {
    return await fetch(
      TutortoiseClient.getBasePath() +
        PARENT_DETAILS_ENDPOINT.replace("{id}", String(id)),
    )
      .then((res) => res.json())
      .catch((err) => console.error("Sessions API call failed:", err));
  },

  getBalance: async (id: string): Promise<number> => {
    return await fetch(
      TutortoiseClient.getBasePath() + BALANCE_ENDPOINT.replace("{id}", id),
      {
        headers: {
          accept: "*/*",
          "content-type": "application/json",
        },
      },
    )
      .then((res) => res.json())
      .catch((err) => console.error("Balance API call failed:", err));
  },

  getAllSessions: async () => {
    return await fetch(TutortoiseClient.getBasePath() + VIEW_SESSIONS_ENDPOINT)
      .then((res) => res.json())
      .catch((err) => console.error("Sessions API call failed:", err));
  },

  getTransactionHistory: async (id: string): Promise<any> => {
    return await fetch(
      TutortoiseClient.getBasePath() +
        TRANSACTION_HISTORY_ENDPOINT.replace("{id}", id),
    )
      .then((res) => res.json())
      .catch((err) => console.error("Transaction History API call failed"));
  },

  buyCredits: async (
    id: string,
    credits: number,
    amount: number,
  ): Promise<any> => {
    return await fetch(TutortoiseClient.getBasePath() + BUY_CREDITS_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        parentId: id,
        credits,
        amount,
      }) as any,
    })
      .then((res) => res.text())
      .catch((err) => console.error("Buy credits API call failed", err));
  },
  addStudent: async (
    parentId: number,
    firstName: string,
    lastName: string,
  ): Promise<any> => {
    return await fetch(TutortoiseClient.getBasePath() + ADD_STUDENT_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        parentId,
        firstName,
        lastName,
      }) as any,
    })
      .then((res) => res.json())
      .catch((err) => console.error("Add students API call failed", err));
  },
  getSessionHistory: async (): Promise<any> => {
    return await fetch(TutortoiseClient.getBasePath() + VIEW_SESSIONS_ENDPOINT)
      .then((res) => res.json())
      .catch((err) =>
        console.error("Transaction History API call failed", err),
      );
  },
  bookSession: async (parentId: number, studentId: number, sessionId: number): Promise<any> => {
    return await fetch(TutortoiseClient.getBasePath() + BOOK_SESSION_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        parentId,
        studentId,
        sessionId
      }) as any,
    })
      .then((res) => res.json())
      .catch((err) => console.error("Book session API call failed", err));
  }
};
