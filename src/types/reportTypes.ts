
export interface Chapter {
  id: string;
  name: string;
  correct: number;
  incorrect: number;
  marks: number;
  maxMarks: number;
  timeSpent: number;
  whatWentWrong?: string;
  learnings?: string;
}

export interface Subject {
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

export interface SubjectData {
  [key: string]: Subject;
}

export interface BattleSession {
  id: string;
  userId: string;
  sessionType: 'war' | 'attack' | 'defense';
  startTime: Date;
  endTime?: Date;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalMarks: number;
  timeSpent: number;
  subjects: SubjectData;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  startTime: Date;
  endTime?: Date;
  timeSpent: number;
  topicsCompleted: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimetableEntry {
  id: string;
  userId: string;
  day: string;
  startTime: string;
  endTime: string;
  category: string;
  color: string;
  notifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubject {
  id: string;
  userId: string;
  name: string;
  progress: number;
  timeSpent: string;
  color: string;
  isPlaying: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserChapter {
  id: string;
  subjectId: string;
  name: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTopic {
  id: string;
  chapterId: string;
  name: string;
  isCompleted: boolean;
  timeSpent?: string;
  createdAt: Date;
  updatedAt: Date;
}
