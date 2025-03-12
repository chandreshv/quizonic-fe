import { motion } from 'framer-motion';
import { Quiz } from '../../types/quiz';

interface SubcategoryCardProps {
  subcategory: string;
  quizzes: Quiz[];
  onSelect: (quizId: string) => void;
}

export const SubcategoryCard = ({ subcategory, quizzes, onSelect }: SubcategoryCardProps) => {
  const quizCount = quizzes.length;
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
      }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => quizzes.length > 0 && onSelect(quizzes[0].id)}
    >
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{subcategory}</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{quizCount} {quizCount === 1 ? 'quiz' : 'quizzes'}</span>
          <motion.div
            whileHover={{ x: 5 }}
            className="text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
