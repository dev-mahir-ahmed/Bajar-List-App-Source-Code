import React, { useState, useEffect } from 'react';
import { ShoppingItem as ShoppingItemType, Category, Language } from '../types';
import { ShoppingItem } from './ShoppingItem';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { getLocalizedCategoryName } from '../lib/utils';


interface CategorySectionProps {
  category: Category;
  items: ShoppingItemType[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  language: Language;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  items,
  onToggle,
  onDelete,
  language,
}) => {
  const isAllCompleted = items.length > 0 && items.every((item) => item.completed);
  const [isCollapsed, setIsCollapsed] = useState(isAllCompleted);

  // Auto collapse when all items become completed
  useEffect(() => {
    if (isAllCompleted) {
      setIsCollapsed(true);
    }
  }, [isAllCompleted]);

  if (items.length === 0) return null;

  return (
    <div className={`mb-6 transition-opacity duration-300 ${isAllCompleted ? 'opacity-60' : 'opacity-100'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between group mb-3"
      >
        <div className="flex items-center gap-2">
          {isAllCompleted && <CheckCircle2 className="text-green-500" size={16} />}
          <h3 
            className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${
              isAllCompleted 
                ? 'text-zinc-400 dark:text-zinc-600 line-through' 
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {!isAllCompleted && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color || '#3b82f6' }} />
            )}
            {getLocalizedCategoryName(category, language)}
          </h3>
        </div>
        
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pb-2 pt-1">
              {items.map((item) => (
                <ShoppingItem 
                  key={item.id} 
                  item={item} 
                  onToggle={onToggle} 
                  onDelete={onDelete} 
                  language={language} 
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
