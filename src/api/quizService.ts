import { Quiz, QuizAttempt, Question } from '../types/quiz';
import apiClient from './client';
import { mockQuizzes, mockAttempts } from '../mocks/quizData';
import { mockQuestions } from '../mocks/questionData';

// For development, use mock data
const USE_MOCK_DATA = true;

export const quizService = {
  // Quiz listing and details
  getQuizzes: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockQuizzes;
    }
    const response = await apiClient.get<Quiz[]>('/quizzes');
    return response.data;
  },

  getQuizById: async (id: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const quiz = mockQuizzes.find(q => q.id === id);
      if (!quiz) throw new Error('Quiz not found');
      return quiz;
    }
    const response = await apiClient.get<Quiz>(`/quizzes/${id}`);
    return response.data;
  },

  // Quiz questions
  getQuizQuestions: async (quizId: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const questions = mockQuestions[quizId];
      if (!questions) throw new Error('Questions not found');
      return questions;
    }
    const response = await apiClient.get<Question[]>(`/quizzes/${quizId}/questions`);
    return response.data;
  },

  // Quiz attempts
  startQuiz: async (quizId: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: Date.now().toString(),
        quizId,
        startTime: new Date().toISOString(),
        answers: [],
      };
    }
    const response = await apiClient.post<QuizAttempt>(`/quizzes/${quizId}/attempts`);
    return response.data;
  },

  submitAnswer: async (attemptId: string, questionId: string, selectedOption: number) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await apiClient.post(`/attempts/${attemptId}/answers`, {
      questionId,
      selectedOption,
    });
    return response.data;
  },

  finishQuiz: async (attemptId: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...mockAttempts[0],
        id: attemptId,
        endTime: new Date().toISOString(),
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      };
    }
    const response = await apiClient.post<QuizAttempt>(`/attempts/${attemptId}/finish`);
    return response.data;
  },

  // User quiz history
  getUserAttempts: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockAttempts;
    }
    const response = await apiClient.get<QuizAttempt[]>('/user/attempts');
    return response.data;
  },

  getAttemptDetails: async (attemptId: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const attempt = mockAttempts.find(a => a.id === attemptId);
      if (!attempt) throw new Error('Attempt not found');
      return attempt;
    }
    const response = await apiClient.get<QuizAttempt>(`/attempts/${attemptId}`);
    return response.data;
  },
};
