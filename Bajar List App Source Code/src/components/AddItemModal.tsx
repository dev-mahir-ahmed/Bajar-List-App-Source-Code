import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Language } from '../types';
import { translations } from '../lib/translations';
import { getLocalizedCategoryName, getCurrencySymbol } from '../lib/utils';

interface AddItemModalProps {
  categories: Category[];
  onAdd: (name: string, categoryId: string, quantity?: string, price?: number) => void;
  language: Language;
  currencyCode: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ 
  categories, 
  onAdd, 
  language,
  currencyCode,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen
}) => {
  const [internalIsOpen, internalSetIsOpen] = useState(false);
  const isControlled = externalIsOpen !== undefined && externalSetIsOpen !== undefined;
  
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  const setIsOpen = isControlled ? externalSetIsOpen : internalSetIsOpen;

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');
  const t = translations[language];

  // Reset fields on modal open
  useEffect(() => {
    if (isOpen) {
      setName('');
      setQuantity('');
      setPrice('');
      setCategoryId('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    if (!categoryId) {
      setError(language === 'bn' ? 'অনুগ্রহ করে একটি ক্যাটাগরি নির্বাচন করুন' : 'Please select a category');
      return;
    }
    const parsedPrice = price.trim() ? parseFloat(price) : undefined;
    onAdd(name.trim(), categoryId, quantity.trim() || undefined, parsedPrice);
    setName('');
    setQuantity('');
    setPrice('');
    setCategoryId('');
    setError('');
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[110px] right-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] z-[70]"
      >
        <Plus size={32} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-[#212124] rounded-3xl p-6 shadow-2xl border border-zinc-100 dark:border-[#2C2C30] mx-2"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{t.addItem}</h2>
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    {t.itemName}
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.itemPlaceholder}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-[#2A2A2E] border-none rounded-xl focus:ring-2 focus:ring-blue-500/30 dark:text-white outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    {t.quantity}
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={t.quantityPlaceholder}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-[#2A2A2E] border-none rounded-xl focus:ring-2 focus:ring-blue-500/30 dark:text-white outline-none font-bold"
                  />
                </div>

                 <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    {language === 'bn' ? 'মূল্য (ঐচ্ছিক)' : 'Price (Optional)'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-zinc-500 dark:text-zinc-400 font-bold text-lg select-none">{getCurrencySymbol(currencyCode)}</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={language === 'bn' ? 'মূল্য (ঐচ্ছিক)' : 'Price (Optional)'}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-[#2A2A2E] border-none rounded-xl focus:ring-2 focus:ring-blue-500/30 dark:text-white outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    {t.category}
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-[#2A2A2E] border-none rounded-xl focus:ring-2 focus:ring-blue-500/30 dark:text-white outline-none appearance-none font-bold"
                  >
                    <option value="">
                      {language === 'bn' ? 'ক্যাটাগরি নির্বাচন করুন' : 'Select Category'}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {getLocalizedCategoryName(cat, language)}
                      </option>
                    ))}
                  </select>
                  {error && (
                    <p className="text-red-500 text-xs font-bold mt-1.5">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                  {t.add}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
