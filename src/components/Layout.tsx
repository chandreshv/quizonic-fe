import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  hideAuthButtons?: boolean;
}

export const Layout = ({ children, hideAuthButtons = false }: LayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Quizonic
              </Link>
            </div>

            {!hideAuthButtons && (
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-gray-700">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Quizonic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
