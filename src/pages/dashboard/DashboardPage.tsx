import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../api/quizService';
import { QuizCard } from '../../components/quiz/QuizCard';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: quizService.getQuizzes,
  });

  const { data: attempts, isLoading: isLoadingAttempts } = useQuery({
    queryKey: ['attempts'],
    queryFn: quizService.getUserAttempts,
  });

  if (isLoading || isLoadingAttempts) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const averageScore = attempts?.length
    ? attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / attempts.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="mt-2 text-gray-600">Ready to challenge yourself with a new quiz?</p>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="text-3xl font-bold text-primary mb-1">
              {attempts?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Quizzes Taken</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {attempts?.filter(a => a.score && a.score > 70).length || 0}
            </div>
            <div className="text-sm text-gray-600">Quizzes Passed</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {averageScore.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
      </div>

      {/* Available Quizzes Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Available Quizzes</h2>
          <div className="flex items-center space-x-2">
            <select className="rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary">
              <option value="">All Categories</option>
              {/* Add categories dynamically */}
            </select>
            <select className="rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary">
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes?.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
          {!quizzes?.length && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No quizzes available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
