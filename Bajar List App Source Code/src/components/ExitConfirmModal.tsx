import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X } from 'lucide-react';
import { Language } from '../types';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language: Language;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  language,
}) => {
  const isBn = language === 'bn';
  const title = isBn ? 'অ্যাপ থেকে বের হোন' : 'Exit App';
  const message = isBn ? 'আপনি কি অ্যাপটি বন্ধ করতে চান?' : 'Do you want to exit this app?';
  const confirmText = isBn ? 'হ্যাঁ' : 'Yes';
  const cancelText = isBn ? 'না' : 'No';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
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
            id="exit-modal-content"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/40 rounded-2xl flex items-center justify-center mb-4">
                <LogOut className="text-zinc-600 dark:text-zinc-300" size={32} />
              </div>
              
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">{title}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-medium">{message}</p>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  id="exit-btn-no"
                  onClick={onClose}
                  className="px-6 py-3.5 bg-zinc-100 dark:bg-[#2A2A2E] text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-[#2A2A2E]/80 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  id="exit-btn-yes"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-sm hover:bg-blue-700 transition-colors"
                >
                  {confirmText}
                </button>
              </div>
            </div>

            <button
              id="exit-modal-close"
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
