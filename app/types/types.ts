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
  students: Student[];
};

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

export type ParentRecord = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentCreditAmount: number;
  numberOfStudents: number;
};

export type StudentStat = {
  studentId: string;
  studentName: string;
  parentId: string | null;
  total: number;
  completed: number;
  scheduled: number;
  lastSeen: string | null;
};

export type StudentProfile = {
  studentId: string;
  studentName: string;
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
  lastSeen: string | null;
  subjects: string[];
  tutors: string[];
  creditsRemaining: number;
};
