import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, HelpCircle, X, Check } from 'lucide-react';
import { Language } from '../types';

interface TutorialPopupProps {
  isOpen: boolean;
  onClose: () => void; // Closes without permanently dismissing
  onPermanentlyDismiss: () => void; // Closes and permanently dismisses
  language: Language;
}

export const TutorialPopup: React.FC<TutorialPopupProps> = ({
  isOpen,
  onClose,
  onPermanentlyDismiss,
  language,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleWatchVideo = () => {
    window.open('https://www.facebook.com/share/v/18uX175nMV/', '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleLater = () => {
    setShowConfirm(true);
  };

  const handleConfirmOk = () => {
    setShowConfirm(false);
    onPermanentlyDismiss();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          {!showConfirm ? (
            /* Main Tutorial Screen */
            <motion.div
              key="main-tutorial"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#212124] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-zinc-100 dark:border-[#2C2C30] z-10 text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-[1.5rem] flex items-center justify-center text-red-600 dark:text-red-400 mb-6 mx-auto shadow-md">
                <Play size={28} className="fill-current ml-1" />
              </div>

              <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
                {language === 'bn' ? 'স্বাগতম!' : 'Welcome!'}
              </h2>

              <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed whitespace-pre-line">
                {language === 'bn'
                  ? 'অ্যাপটি আরও সহজে ব্যবহার করতে এবং সকল ফিচার সম্পর্কে জানতে আমাদের সংক্ষিপ্ত ভিডিওটি দেখে নিন।\n\nআপনি চাইলে পরবর্তীতেও সেটিংস → কমিউনিটি ও সাপোর্ট → অ্যাপ ব্যবহারের নির্দেশিকা থেকে ভিডিওটি দেখতে পারবেন।'
                  : 'To make using the app even easier and learn about all its features, check out our short video guide.\n\nYou can also watch it later from Settings → Community & Support → App Usage Guide.'}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleWatchVideo}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play size={18} className="fill-current" />
                  <span>{language === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLater}
                  className="w-full py-3.5 bg-zinc-100 dark:bg-[#2A2A2E] hover:bg-zinc-200 dark:hover:bg-[#34343a] text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl transition-all cursor-pointer text-sm"
                >
                  {language === 'bn' ? 'পরে দেখব' : 'Maybe Later'}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          ) : (
            /* Confirmation Screen */
            <motion.div
              key="confirm-later"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#212124] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-zinc-100 dark:border-[#2C2C30] z-10 text-center"
            >
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 rounded-[1.5rem] flex items-center justify-center text-amber-500 dark:text-amber-400 mb-6 mx-auto shadow-md">
                <span className="text-3xl">😊</span>
              </div>

              <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
                {language === 'bn' ? 'কোনো সমস্যা নেই 😊' : 'No problem 😊'}
              </h2>

              <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
                {language === 'bn'
                  ? 'আপনি চাইলে যেকোনো সময় সেটিংস → কমিউনিটি ও সাপোর্ট → অ্যাপ ব্যবহারের নির্দেশিকা অপশন থেকে ভিডিওটি দেখে অ্যাপের সকল ফিচার সহজে শিখে নিতে পারবেন।'
                  : 'You can easily learn all the features of the app by watching the video anytime from the Settings → Community & Support → App Usage Guide option.'}
              </p>

              <button
                type="button"
                onClick={handleConfirmOk}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={18} />
                <span>{language === 'bn' ? 'ঠিক আছে' : 'Okay'}</span>
              </button>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
