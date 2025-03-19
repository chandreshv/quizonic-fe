import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/dashboard'
    },
    {
      name: 'Did You Know',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      path: '/did-you-know'
    }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div 
      className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Sidebar Toggle Button */}
      <button 
        onClick={toggleSidebar} 
        className="absolute top-4 right-4 z-50 text-gray-600 hover:text-primary"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Logo */}
      <div className="p-4 border-b flex items-center justify-center">
        <img 
          src="/vite.svg" 
          alt="Quizonic Logo" 
          className={`transition-all duration-300 ${
            isOpen ? 'w-24' : 'w-10'
          }`} 
        />
      </div>

      {/* Menu Items */}
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`flex items-center p-4 hover:bg-primary/10 transition-colors ${
              location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-gray-700'
            }`}
          >
            <span className="mr-4">{item.icon}</span>
            {isOpen && <span className="text-sm font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </motion.div>
  );
};
