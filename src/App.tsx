import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { QuizPage } from './pages/quiz/QuizPage';
import { QuizAttemptPage } from './pages/quiz/QuizAttemptPage';
import { QuizResultPage } from './pages/quiz/QuizResultPage';
import { GuestHomePage } from './pages/home/GuestHomePage';
import { LoginOptions } from './pages/auth/LoginOptions';
import { DidYouKnowPage } from './pages/DidYouKnowPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LoginOptions />} />
            <Route path="/guest" element={<GuestHomePage />} />
            <Route
              path="/quiz/:id"
              element={
                <Layout hideAuthButtons>
                  <QuizPage />
                </Layout>
              }
            />
            <Route
              path="/quiz/:quizId/attempt/:attemptId"
              element={<QuizAttemptPage />}
            />
            <Route
              path="/quiz/:quizId/result/:attemptId"
              element={<QuizResultPage />}
            />

            {/* Auth routes */}
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute requireAuth={false}>
                  <RegisterPage />
                </ProtectedRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div>Profile Page (To be implemented)</div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/did-you-know"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DidYouKnowPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">404</h1>
                    <p className="mt-2 text-lg text-gray-600">Page not found</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
