import React from 'react';
import { ShoppingBag, Settings, User, ReceiptText } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface BottomNavProps {
  activeTab: 'list' | 'hisab' | 'settings' | 'developer';
  setActiveTab: (tab: 'list' | 'hisab' | 'settings' | 'developer') => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, language }) => {
  const t = translations[language];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#161619] border-t border-zinc-100 dark:border-white/5 px-4 py-3 pb-8 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <NavButton
          active={activeTab === 'list'}
          onClick={() => setActiveTab('list')}
          icon={<ShoppingBag size={22} />}
          label={t.bazar}
        />
        <NavButton
          active={activeTab === 'hisab'}
          onClick={() => setActiveTab('hisab')}
          icon={<ReceiptText size={22} />}
          label={t.hisab}
        />
        <NavButton
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
          icon={<Settings size={22} />}
          label={t.settings}
        />
        <NavButton
          active={activeTab === 'developer'}
          onClick={() => setActiveTab('developer')}
          icon={<User size={22} />}
          label={t.developer}
        />
      </div>
    </nav>
  );
};

const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center transition-all duration-200 relative cursor-pointer select-none py-1 flex-1 max-w-[80px]"
    >
      {/* Icon with active pill background */}
      <div className="relative py-1.5 px-6 rounded-full transition-all flex items-center justify-center min-h-[32px] min-w-[56px]">
        {active && (
          <motion.div
            layoutId="active-nav-pill"
            className="absolute inset-0 bg-blue-50/70 dark:bg-[#2A2A2E] rounded-full -z-10"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <div className={`transition-colors duration-200 ${active ? 'text-blue-600 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`}>
          {icon}
        </div>
      </div>
      
      <span className={`text-[10px] font-black tracking-wide mt-1 transition-colors duration-200 ${
        active ? 'text-blue-600 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'
      }`}>
        {label}
      </span>
    </button>
  );
};
