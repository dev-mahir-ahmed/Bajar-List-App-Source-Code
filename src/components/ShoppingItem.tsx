import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ShoppingItem as ShoppingItemType, Language } from '../types';
import { translations } from '../lib/translations';

interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  language: Language;
}

export const ShoppingItem: React.FC<ShoppingItemProps> = ({ item, onToggle, onDelete, language }) => {
  const t = translations[language];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
        item.completed
          ? 'bg-zinc-50 dark:bg-[#1E1E22]/50 opacity-60'
          : 'bg-white dark:bg-[#212124] shadow-sm border border-zinc-100 dark:border-[#2C2C30]'
      }`}
    >
      <button
        onClick={() => onToggle(item.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-zinc-300 dark:border-zinc-700'
        }`}
      >
        {item.completed && <Check size={14} />}
      </button>

      <div className="flex-1 flex flex-col">
        <span
          className={`text-base font-bold text-zinc-800 dark:text-zinc-200 ${
            item.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
          }`}
        >
          {item.name}
        </span>
        {item.quantity && (
          <span className={`text-xs font-medium ${item.completed ? 'text-zinc-400 opacity-50' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {t.quantity}: {item.quantity}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
};
