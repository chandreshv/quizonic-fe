import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../api/quizService';

export const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const { data: quiz, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizService.getQuizById(id!),
  });

  const handleStartQuiz = async () => {
    if (!quiz) return;
    
    setIsStarting(true);
    try {
      const attempt = await quizService.startQuiz(quiz.id);
      navigate(`/quiz/${quiz.id}/attempt/${attempt.id}`);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      setIsStarting(false);
    }
  };

  if (isLoadingQuiz) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Quiz not found</h2>
        <p className="mt-2 text-gray-600">The quiz you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary hover:text-primary/90"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="mt-2 text-gray-600">{quiz.description}</p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              quiz.difficulty === 'EASY'
                ? 'bg-green-100 text-green-800'
                : quiz.difficulty === 'MEDIUM'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {quiz.difficulty}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Duration: {quiz.duration} minutes
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Questions: {quiz.totalQuestions}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-primary rounded-full"></span>
            <span className="ml-2">You have {quiz.duration} minutes to complete the quiz.</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-primary rounded-full"></span>
            <span className="ml-2">Each question has only one correct answer.</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-primary rounded-full"></span>
            <span className="ml-2">You cannot return to previous questions once answered.</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-primary rounded-full"></span>
            <span className="ml-2">A score of 70% or higher is required to pass the quiz.</span>
          </li>
        </ul>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            Return to Dashboard
          </button>
          <button
            onClick={handleStartQuiz}
            disabled={isStarting}
            className="btn btn-primary flex items-center"
          >
            {isStarting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Starting Quiz...
              </>
            ) : (
              'Start Quiz'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
