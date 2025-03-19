import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DidYouKnowFact {
  id: number;
  category: string;
  fact: string;
  source?: string;
}

const initialFacts: DidYouKnowFact[] = [
  {
    id: 1,
    category: 'Science',
    fact: 'The human brain is more active during sleep than during the day.',
    source: 'National Sleep Foundation'
  },
  {
    id: 2,
    category: 'Nature',
    fact: 'Honeybees can recognize human faces, just like humans do.',
    source: 'Scientific American'
  },
  {
    id: 3,
    category: 'Technology',
    fact: 'The first computer bug was an actual bug - a moth trapped in a computer relay in 1947.',
    source: 'Computer History Museum'
  },
  {
    id: 4,
    category: 'History',
    fact: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.',
    source: 'Historical Perspectives'
  },
  {
    id: 5,
    category: 'Space',
    fact: 'A day on Venus is longer than its year. Venus rotates so slowly that it takes 243 Earth days to complete one rotation.',
    source: 'NASA'
  }
];

export const DidYouKnowPage = () => {
  const [currentFact, setCurrentFact] = useState<DidYouKnowFact | null>(null);
  const [facts, setFacts] = useState<DidYouKnowFact[]>(initialFacts);

  useEffect(() => {
    // Randomly select a fact when the component mounts
    if (facts.length > 0) {
      const randomIndex = Math.floor(Math.random() * facts.length);
      setCurrentFact(facts[randomIndex]);
    }
  }, []);

  const getNextFact = () => {
    if (facts.length > 1) {
      const currentIndex = facts.findIndex(f => f.id === currentFact?.id);
      const nextIndex = (currentIndex + 1) % facts.length;
      setCurrentFact(facts[nextIndex]);
    }
  };

  const getPreviousFact = () => {
    if (facts.length > 1) {
      const currentIndex = facts.findIndex(f => f.id === currentFact?.id);
      const prevIndex = (currentIndex - 1 + facts.length) % facts.length;
      setCurrentFact(facts[prevIndex]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentFact && (
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-primary font-semibold">
              {currentFact.category}
            </div>
            <motion.blockquote 
              className="mt-4 text-xl italic text-gray-800"
              key={currentFact.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              "{currentFact.fact}"
            </motion.blockquote>
            
            {currentFact.source && (
              <div className="mt-4 text-sm text-gray-600">
                - {currentFact.source}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between p-4 bg-gray-50">
          <motion.button 
            onClick={getPreviousFact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary hover:text-primary/80 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Fact
          </motion.button>

          <motion.button 
            onClick={getNextFact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary hover:text-primary/80 flex items-center"
          >
            Next Fact
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
