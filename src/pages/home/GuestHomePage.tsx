import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../api/quizService';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryCard } from '../../components/quiz/CategoryCard';
import { SubcategoryCard } from '../../components/quiz/SubcategoryCard';
import { Quiz } from '../../types/quiz';

// Define view states
type ViewState = 'categories' | 'subcategories';

// Define category data with icons and colors
const categoryData = [
  { name: 'Mathematics', icon: '🔢', color: 'bg-blue-100' },
  { name: 'Science', icon: '🔬', color: 'bg-green-100' },
  { name: 'English', icon: '📚', color: 'bg-yellow-100' },
  { name: 'Geography', icon: '🌍', color: 'bg-purple-100' },
  { name: 'History', icon: '⏳', color: 'bg-red-100' },
  { name: 'Art', icon: '🎨', color: 'bg-pink-100' },
];

// Helper function to get subcategories for a category
const getSubcategories = (quizzes: Quiz[], category: string): string[] => {
  if (!quizzes) return [];
  
  const subcategories = new Set<string>();
  quizzes
    .filter(quiz => quiz.category === category)
    .forEach(quiz => {
      // For this example, we'll use difficulty as subcategory
      subcategories.add(quiz.difficulty);
    });
  
  return Array.from(subcategories);
};

// Helper function to get quizzes for a subcategory
const getQuizzesForSubcategory = (quizzes: Quiz[], category: string, subcategory: string): Quiz[] => {
  if (!quizzes) return [];
  
  return quizzes.filter(quiz => 
    quiz.category === category && 
    quiz.difficulty === subcategory
  );
};

export const GuestHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const guestName = location.state?.guestName || 'Guest';
  const age = location.state?.age || 10; // Default to 10 if age is not provided
  
  // Determine age group for content filtering
  const ageGroup = age < 8 ? 'young' : age < 12 ? 'middle' : 'teen';
  
  // State for navigation between categories and subcategories
  const [viewState, setViewState] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: quizService.getQuizzes,
  });
  
  // Filter categories based on age group
  const filteredCategories = categoryData.filter(category => {
    if (!quizzes) return true;
    
    // Check if there are any quizzes in this category for the current age group
    return quizzes.some(quiz => {
      if (quiz.category !== category.name) return false;
      
      if (!quiz.ageRange) return true;
      
      if (ageGroup === 'young') {
        return (quiz.ageRange.min || 5) <= 7;
      } else if (ageGroup === 'middle') {
        return (quiz.ageRange.min || 5) <= 11 && (quiz.ageRange.max || 15) >= 8;
      } else {
        return (quiz.ageRange.max || 15) >= 12;
      }
    });
  });
  
  // Get subcategories for the selected category
  const subcategories = getSubcategories(quizzes || [], selectedCategory);
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setViewState('subcategories');
  };
  
  // Handle subcategory selection
  const handleSubcategorySelect = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };
  
  // Handle back button
  const handleBackToCategories = () => {
    setViewState('categories');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Quizonic, {guestName}! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Fun quizzes for curious minds
            </p>
            <p className="text-md text-gray-500 mb-8">
              Age: {age} years old | Content tailored for {ageGroup === 'young' ? 'younger kids (5-7)' : 
                ageGroup === 'middle' ? 'middle age kids (8-11)' : 'teens (12-15)'}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {viewState === 'categories' ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {ageGroup === 'young' ? 'Choose a Fun Topic! 🚀' : 
                  ageGroup === 'middle' ? 'Select a Category! 🚀' : 
                  'Pick Your Challenge! 🚀'}
                </h2>
                <p className="text-lg text-gray-600">
                  {ageGroup === 'young' ? 'Tap on a colorful card to start!' : 
                  ageGroup === 'middle' ? 'Choose what you want to learn about!' : 
                  'Select a category to test your knowledge!'}
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CategoryCard
                        category={category.name}
                        icon={category.icon}
                        color={category.color}
                        onSelect={handleCategorySelect}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="subcategories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Categories
                </button>
              </div>
              
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedCategory} Quizzes
                </h2>
                <p className="text-lg text-gray-600">
                  Choose a difficulty level to start your quiz
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subcategories.map((subcategory, index) => {
                    const subcategoryQuizzes = getQuizzesForSubcategory(
                      quizzes || [], 
                      selectedCategory, 
                      subcategory
                    ).filter(quiz => {
                      if (!quiz.ageRange) return true;
                      
                      if (ageGroup === 'young') {
                        return (quiz.ageRange.min || 5) <= 7;
                      } else if (ageGroup === 'middle') {
                        return (quiz.ageRange.min || 5) <= 11 && (quiz.ageRange.max || 15) >= 8;
                      } else {
                        return (quiz.ageRange.max || 15) >= 12;
                      }
                    });
                    
                    return (
                      <motion.div
                        key={subcategory}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <SubcategoryCard
                          subcategory={subcategory}
                          quizzes={subcategoryQuizzes}
                          onSelect={handleSubcategorySelect}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
                Age-appropriate content
              </p>
            </div>
            <div>
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                No ads for kids
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
