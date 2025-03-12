import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../api/quizService';
import { Question } from '../../types/quiz';
import '../../styles/quiz.css';

export const QuizAttemptPage = () => {
  const { quizId, attemptId } = useParams<{ quizId: string; attemptId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: () => quizService.getQuizQuestions(quizId!),
  });

  const currentQuestion: Question | undefined = questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (questions?.length ?? 0) - 1;
  const progress = ((currentQuestionIndex + 1) / (questions?.length ?? 1)) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = async () => {
    if (selectedOption === null || !currentQuestion || !attemptId) return;

    setIsSubmitting(true);
    try {
      await quizService.submitAnswer(attemptId, currentQuestion.id, selectedOption);

      if (isLastQuestion) {
        const result = await quizService.finishQuiz(attemptId);
        // Show a fun celebration animation here
        navigate(`/quiz/${quizId}/result/${attemptId}`, { state: { result } });
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
        <p className="mt-2 text-gray-600">Let's try another quiz!</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary hover:text-primary/90"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="question-number">
          Question {currentQuestionIndex + 1} of {questions?.length}
        </div>
        <div className="timer">Time: 29:45</div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="question-container">
        <h2 className="question-text">{currentQuestion.text}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isSubmitting}
              className={`option-button ${
                selectedOption === index ? 'selected' : ''
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 w-6 h-6 mr-3 rounded-full border-2 ${
                    selectedOption === index
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedOption === index && (
                    <div className="w-full h-full rounded-full bg-white transform scale-50" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            Exit Quiz
          </button>
          <button
            onClick={handleNext}
            disabled={selectedOption === null || isSubmitting}
            className="next-button"
          >
            {isSubmitting ? (
              <div className="flex items-center">
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
                Checking...
              </div>
            ) : isLastQuestion ? (
              'Finish Quiz'
            ) : (
              'Next Question'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
