import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../api/quizService';
import { QuizCard } from '../../components/quiz/QuizCard';

export const GuestHomePage = () => {
  const navigate = useNavigate();
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: quizService.getQuizzes,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Quizonic! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Fun quizzes for curious minds aged 5-15 years
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="btn btn-primary"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start Playing Now! 🚀
          </h2>
          <p className="text-lg text-gray-600">
            No account needed - just pick a quiz and have fun!
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes?.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-yellow-50 rounded-lg text-yellow-700 text-sm">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Parents: Create an account to track progress and access more features!
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fun Learning</h3>
              <p className="text-gray-600">
                Engaging quizzes that make learning enjoyable
              </p>
            </div>
            <div>
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Kid-Friendly</h3>
              <p className="text-gray-600">
                Age-appropriate content for children 5-15 years
              </p>
            </div>
            <div>
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Child-safe environment with no ads
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
