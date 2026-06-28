import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingItem, Language } from '../types';
import { getCurrencySymbol } from '../lib/utils';

interface PricePromptModalProps {
  item: ShoppingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, price: number) => void;
  language: Language;
  currencyCode: string;
}

export const PricePromptModal: React.FC<PricePromptModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  language,
  currencyCode,
}) => {
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  // Clear states when item changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setPrice('');
      setError('');
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrice = price.trim();
    if (!cleanPrice) {
      setError(language === 'bn' ? 'টাকার পরিমাণ খালি রাখা যাবে না।' : 'Price cannot be empty.');
      return;
    }
    const parsed = parseFloat(cleanPrice);
    if (isNaN(parsed) || parsed <= 0) {
      setError(language === 'bn' ? 'দয়া করে একটি সঠিক ধনাত্মক সংখ্যা লিখুন।' : 'Please enter a valid positive number.');
      return;
    }

    onSave(item.id, parsed);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white dark:bg-[#212124] rounded-3xl p-6 shadow-2xl border border-zinc-100 dark:border-[#2C2C30] mx-2 z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <span>🛒</span> {language === 'bn' ? 'বাজার সম্পন্ন' : 'Item Completed'}
              </h3>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 mb-3 leading-snug">
                  {language === 'bn' 
                    ? `"${item.name}" পণ্যটি কত মূল্যে কিনেছেন?`
                    : `How much did you pay for "${item.name}"?`}
                </p>

                <div className="relative flex items-center">
                  <span className="absolute left-4 text-zinc-500 dark:text-zinc-400 font-bold text-lg select-none">{getCurrencySymbol(currencyCode)}</span>
                  <input
                    autoFocus
                    type="number"
                    step="any"
                    min="0.01"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder={language === 'bn' ? 'মূল্য' : 'Price amount'}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-[#2A2A2E] border-none rounded-xl focus:ring-2 focus:ring-blue-500/30 dark:text-white outline-none font-black text-lg"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold mt-2">
                    ⚠️ {error}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-1.5 text-sm"
                >
                  <Check size={16} />
                  {language === 'bn' ? 'সংরক্ষণ ও সম্পন্ন' : 'Save & Complete'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
