export type ExamBoard = 'Cambridge' | 'Edexcel';

export interface Subject {
  name: string;
  code: string;
}

export interface SubjectsByBoard {
  Cambridge: Subject[];
  Edexcel: Subject[];
}

export interface ExamVenue {
  board: ExamBoard;
  code: string;
}

export interface ExamInfo {
  board: ExamBoard;
  subject: Subject;
  date: Date;
  startTime: string;
  endTime: string;
  venue: string;
} 