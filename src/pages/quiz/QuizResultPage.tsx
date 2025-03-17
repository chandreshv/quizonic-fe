import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';

// Type definition for Confetti props
interface ConfettiProps {
  width?: number;
  height?: number;
  numberOfPieces?: number;
  recycle?: boolean;
}

export const QuizResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams();
  const [windowSize, setWindowSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  // Get result from location state or mock data
  const result = location.state?.result || {
    score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
    totalQuestions: 10
  };

  // Calculate percentage
  const scorePercentage = Math.round((result.score / (result.totalQuestions * 10)) * 100);

  // Determine performance level
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { 
      message: 'Excellent! 🏆', 
      color: 'text-green-600',
      emoji: '🌟'
    };
    if (percentage >= 75) return { 
      message: 'Great Job! 👏', 
      color: 'text-blue-600',
      emoji: '🎉'
    };
    return { 
      message: 'Good Effort! 👍', 
      color: 'text-yellow-600',
      emoji: '🌈'
    };
  };

  const performanceLevel = getPerformanceLevel(scorePercentage);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRetakeQuiz = () => {
    navigate(`/quiz/${quizId}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      {/* Confetti Animation */}
      <ReactConfetti 
        width={windowSize.width} 
        height={windowSize.height}
        numberOfPieces={scorePercentage > 75 ? 200 : 50}
        recycle={false}
      />

      <motion.div 
        className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <motion.div 
          className={`text-6xl mb-4 ${performanceLevel.color}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
        >
          {performanceLevel.emoji}
        </motion.div>

        <h1 className={`text-3xl font-bold mb-4 ${performanceLevel.color}`}>
          {performanceLevel.message}
        </h1>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-xl font-semibold text-blue-800">
            Your Score: {result.score} / {result.totalQuestions * 10}
          </p>
          <p className="text-lg text-blue-600">
            {scorePercentage}% Completed
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            onClick={handleRetakeQuiz}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retake Quiz
          </motion.button>

          <motion.button
            onClick={handleGoHome}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
