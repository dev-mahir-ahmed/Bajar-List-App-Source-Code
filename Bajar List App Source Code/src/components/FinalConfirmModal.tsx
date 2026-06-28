import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { Language } from '../types';

interface FinalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language: Language;
}

export const FinalConfirmModal: React.FC<FinalConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  language,
}) => {
  const [inputText, setInputText] = useState('');

  // Clear input when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setInputText('');
    }
  }, [isOpen]);

  const isValid = inputText.trim().toUpperCase() === 'OK';

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-[#212124] rounded-3xl p-6 shadow-2xl border border-zinc-100 dark:border-[#2C2C30]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle className="text-amber-500" size={32} />
              </div>
              
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                {language === 'bn' ? 'চূড়ান্ত নিশ্চিতকরণ' : 'Final Confirmation'}
              </h2>
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                {language === 'bn' 
                  ? 'এই কাজটি আর ফিরিয়ে আনা যাবে না। সমস্ত তথ্য মুছে ফেলতে নিচে OK লিখুন।' 
                  : 'This action cannot be undone. Type OK below to delete all data.'}
              </p>

              <div className="w-full mb-6">
                <input
                  type="text"
                  autoFocus
                  placeholder={language === 'bn' ? 'OK লিখুন' : 'Type OK'}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full text-center px-4 py-3 bg-zinc-100 dark:bg-[#2A2A2E] border-2 border-transparent focus:border-amber-500 rounded-xl outline-none font-black text-lg dark:text-white transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-zinc-100 dark:bg-[#2A2A2E] text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-[#2A2A2E]/80 transition-colors text-sm cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  disabled={!isValid}
                  onClick={handleConfirm}
                  className={`px-6 py-3 font-bold rounded-2xl shadow-sm transition-all text-sm flex items-center justify-center gap-1.5 ${
                    isValid 
                      ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer' 
                      : 'bg-zinc-100 dark:bg-[#2A2A2E] text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {language === 'bn' ? 'সব মুছুন' : 'Delete All'}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
