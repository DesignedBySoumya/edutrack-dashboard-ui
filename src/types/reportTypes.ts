
export interface ChapterData {
  name: string;
  icon: string;
  color: string;
  maxMarks: number;
  obtainedMarks: number;
  accuracy: number;
  timeSpent: number;
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
}

export interface ReportData {
  chapters: ChapterData[];
  totalMarks: number;
  obtainedMarks: number;
  accuracy: number;
  timeSpent: number;
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
}

export interface SubjectReport {
  name: string;
  icon: string;
  color: string;
  chapters: ChapterData[];
}
