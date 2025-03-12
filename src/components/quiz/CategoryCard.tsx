import { motion } from 'framer-motion';
import { useState } from 'react';

interface CategoryCardProps {
  category: string;
  icon: string;
  color: string;
  onSelect: (category: string) => void;
}

export const CategoryCard = ({ category, icon, color, onSelect }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`rounded-lg shadow-md overflow-hidden cursor-pointer ${color}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(category)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <motion.div
            animate={{ 
              rotate: isHovered ? 10 : 0,
              scale: isHovered ? 1.2 : 1
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-4xl"
          >
            {icon}
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold text-center text-gray-800">{category}</h3>
      </div>
    </motion.div>
  );
};
