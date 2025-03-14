import { useState, useEffect } from 'react';
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
  const [answerChecked, setAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: () => quizService.getQuizQuestions(quizId!),
  });

  const currentQuestion: Question | undefined = questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (questions?.length ?? 0) - 1;
  const progress = ((currentQuestionIndex + 1) / (questions?.length ?? 1)) * 100;

  // Effect to move to next question after delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (answerChecked) {
      // Show explanation for 2 seconds
      setShowExplanation(true);
      
      // Move to next question after 3 seconds
      timer = setTimeout(() => {
        if (isLastQuestion) {
          handleFinishQuiz();
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setAnswerChecked(false);
          setIsCorrect(false);
          setShowExplanation(false);
        }
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [answerChecked, isLastQuestion]);

  const handleOptionSelect = async (optionIndex: number) => {
    if (answerChecked || isSubmitting || !currentQuestion || !attemptId) return;
    
    setSelectedOption(optionIndex);
    setIsSubmitting(true);
    
    try {
      await quizService.submitAnswer(attemptId, currentQuestion.id, optionIndex);
      
      // Check if answer is correct
      const isAnswerCorrect = optionIndex === currentQuestion.correctOption;
      setIsCorrect(isAnswerCorrect);
      setAnswerChecked(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishQuiz = async () => {
    if (!attemptId) return;
    
    try {
      const result = await quizService.finishQuiz(attemptId);
      navigate(`/quiz/${quizId}/result/${attemptId}`, { state: { result } });
    } catch (error) {
      console.error('Failed to finish quiz:', error);
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

        {/* Grid layout for options */}
        <div 
          className={`grid gap-4 ${
            currentQuestion.options.length === 2 
              ? 'grid-cols-1' // 1x1 grid for true-false
              : 'grid-cols-1 md:grid-cols-2' // 2x2 grid for 4 options
          }`}
        >
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'option-button';
            
            if (answerChecked) {
              if (index === currentQuestion.correctOption) {
                buttonClass += ' correct';
              } else if (selectedOption === index) {
                buttonClass += ' incorrect';
              } else {
                buttonClass += ' disabled';
              }
            } else if (selectedOption === index) {
              buttonClass += ' selected';
            }
            
            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isSubmitting || answerChecked}
                className={buttonClass}
              >
                <div className="flex items-center">
                  {!answerChecked && (
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
                  )}
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium mb-1">{isCorrect ? '✓ Correct!' : '✗ Incorrect!'}</p>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
