import { Quiz, QuizAttempt } from '../types/quiz';

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Fun with Numbers',
    description: 'Test your math skills with these fun and easy number problems!',
    duration: 15,
    totalQuestions: 10,
    category: 'Mathematics',
    difficulty: 'EASY',
    ageRange: {
      min: 5,
      max: 8
    }
  },
  {
    id: '2',
    title: 'Animal Kingdom',
    description: 'Learn amazing facts about different animals and their habitats.',
    duration: 20,
    totalQuestions: 15,
    category: 'Science',
    difficulty: 'EASY',
    ageRange: {
      min: 6,
      max: 10
    }
  },
  {
    id: '3',
    title: 'Space Adventure',
    description: 'Explore the solar system and discover fascinating space facts!',
    duration: 20,
    totalQuestions: 12,
    category: 'Science',
    difficulty: 'MEDIUM',
    ageRange: {
      min: 8,
      max: 12
    }
  },
  {
    id: '4',
    title: 'English Word Fun',
    description: 'Improve your vocabulary with fun word games and puzzles.',
    duration: 15,
    totalQuestions: 10,
    category: 'English',
    difficulty: 'EASY',
    ageRange: {
      min: 7,
      max: 11
    }
  },
  {
    id: '5',
    title: 'Geography Explorer',
    description: 'Travel around the world and learn about different countries!',
    duration: 25,
    totalQuestions: 15,
    category: 'Geography',
    difficulty: 'MEDIUM',
    ageRange: {
      min: 9,
      max: 14
    }
  },
  {
    id: '6',
    title: 'Science Lab',
    description: 'Discover amazing science facts and experiments.',
    duration: 20,
    totalQuestions: 12,
    category: 'Science',
    difficulty: 'MEDIUM',
    ageRange: {
      min: 10,
      max: 15
    }
  },
];

export const mockAttempts: QuizAttempt[] = [
  {
    id: '1',
    quizId: '1',
    startTime: '2025-03-11T10:00:00Z',
    endTime: '2025-03-11T10:25:00Z',
    score: 85,
    answers: [
      { questionId: '1', selectedOption: 2 },
      { questionId: '2', selectedOption: 1 },
    ],
  },
  {
    id: '2',
    quizId: '3',
    startTime: '2025-03-10T15:00:00Z',
    endTime: '2025-03-10T15:30:00Z',
    score: 92,
    answers: [
      { questionId: '1', selectedOption: 0 },
      { questionId: '2', selectedOption: 3 },
    ],
  },
];
