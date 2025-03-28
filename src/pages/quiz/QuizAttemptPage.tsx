import { useState, useEffect, useRef } from 'react';
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
  const [timerHeight, setTimerHeight] = useState(0);
  const [isTimerWarning, setIsTimerWarning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerDuration = 10000; // 10 seconds in milliseconds

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: () => quizService.getQuizQuestions(quizId!),
  });

  const currentQuestion: Question | undefined = questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (questions?.length ?? 0) - 1;
  const progress = ((currentQuestionIndex + 1) / (questions?.length ?? 1)) * 100;

  // Function to move to next question
  const moveToNextQuestion = () => {
    console.log('Moving to next question', { 
      isLastQuestion, 
      currentQuestionIndex, 
      totalQuestions: questions?.length 
    });

    if (isLastQuestion) {
      handleFinishQuiz();
    } else {
      setCurrentQuestionIndex(prev => {
        console.log('Previous index:', prev, 'New index:', prev + 1);
        return prev + 1;
      });
      setSelectedOption(null);
      setAnswerChecked(false);
      setIsCorrect(false);
      setShowExplanation(false);
    }
  };

  // Function to handle when time is up
  const handleTimeUp = async () => {
    console.log('Time up called', { 
      answerChecked, 
      isSubmitting, 
      currentQuestion, 
      attemptId 
    });

    if (answerChecked || isSubmitting || !currentQuestion || !attemptId) return;
    
    setIsSubmitting(true);
    setSelectedOption(-1);
    
    try {
      // Submit with a special value (-1) to indicate time's up / not attempted
      await quizService.submitAnswer(attemptId, currentQuestion.id, -1);
      
      // Award 0 marks and immediately move to next question
      // without showing explanation
      moveToNextQuestion();
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect to handle question timer
  useEffect(() => {
    // Reset timer when question changes or answer is checked
    setTimerHeight(0);
    setIsTimerWarning(false);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    if (!answerChecked) {
      // Start the timer
      const startTime = Date.now();
      const intervalTime = 100; // Update every 100ms for smooth animation
      
      timerIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / questionTimerDuration, 1);
        setTimerHeight(progress * 100);
        
        // Set warning state when timer reaches 80%
        if (progress >= 0.8) {
          setIsTimerWarning(true);
        }
        
        // If timer reaches 100% and no option selected, mark as not attempted
        if (progress >= 1 && selectedOption === null && !answerChecked) {
          console.log('Timer reached 100%', { 
            currentQuestionIndex, 
            selectedOption, 
            answerChecked 
          });
          
          // Time's up - mark as not attempted
          handleTimeUp();
          
          // Clear the interval
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
        }
      }, intervalTime);
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentQuestionIndex, answerChecked, selectedOption, currentQuestion]);
  
  // Removed as the timer warning reset is now handled in the timer effect
  
  // Effect to move to next question after delay (only for user-selected answers)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (answerChecked && selectedOption !== -1) {
      // Show explanation for 2 seconds
      setShowExplanation(true);
      
      // Move to next question after 3 seconds
      timer = setTimeout(() => {
        moveToNextQuestion();
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [answerChecked, isLastQuestion, selectedOption]);

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
      navigate(`/quiz/${quizId}/result/${attemptId}`, { 
        state: { 
          result: {
            ...result,
            totalQuestions: questions?.length || 10
          } 
        } 
      });
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
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="question-container">
        {/* Vertical timer */}
        <div className="vertical-timer-container">
          <div 
            className={`vertical-timer-fill ${isTimerWarning ? 'warning' : ''}`}
            style={{ height: `${timerHeight}%` }}
          />
        </div>
        
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
        {showExplanation && (
          <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium mb-1">
              {selectedOption === -1 ? '⏱️ Time\'s Up!' : isCorrect ? '✓ Correct!' : '✗ Incorrect!'}
            </p>
            {currentQuestion.explanation && <p>{currentQuestion.explanation}</p>}
            {selectedOption === -1 && <p>You didn't answer in time. The correct answer was: {currentQuestion.options[currentQuestion.correctOption]}</p>}
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
