export type Student = {
  studentId: number;
  parentId: number;
  studentName: string;
  notes: string;
  sessionsCompleted: number;
  previousScore: number;
  latestScore: number;
  sessions: Session[];
};

export type Parent = {
  status: string;
  operationStatus: string;
  message: string;
  parentId: number;
  parentName: string;
  parentEmail: string;
  sessionCount: number;
  creditBalance: number;
  students: Student[]
}

export type Session = {
  sessionId: number;
  parentId: number;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  notes: string;
    subject: string;
  tutorId: number;
  tutorName: string;
  sessionStatus: string;
  datetimeStarted: string;
  durationHours: number;
  assessmentPointsEarned: number;
  assessmentPointsGoal: number;
  assessmentPointsMax: number;
};