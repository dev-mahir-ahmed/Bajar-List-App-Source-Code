import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';
import logo from '../assets/images/bajar_list_logo.png';

interface HeaderProps {
  language: Language;
}

export const Header: React.FC<HeaderProps> = ({ language }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center pt-4 pb-2 w-full"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-6 relative group"
      >
        <div className="relative p-1.5 bg-white dark:bg-[#212124] rounded-[2.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-zinc-100 dark:border-white/5">
          <img 
            src={logo} 
            alt="Bajar List Logo" 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1.8rem] object-cover shadow-inner"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
          বাজার লিস্ট
        </h1>
        
        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 tracking-[0.2em] uppercase opacity-70">
          Developer: Mahir Ahmed
        </p>
      </div>
    </motion.header>
  );
};
