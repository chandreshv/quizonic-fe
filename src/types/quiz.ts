export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  ageRange?: {
    min: number;
    max: number;
  };
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  quizId: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  answers: {
    questionId: string;
    selectedOption: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
