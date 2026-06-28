import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import logo from '../assets/images/bajar_list_logo.png';

interface LanguagePopupProps {
  isOpen: boolean;
  onSelect: (lang: Language, currencyCode: string) => void;
}

export const LanguagePopup: React.FC<LanguagePopupProps> = ({ isOpen, onSelect }) => {
  const [selectedLang, setSelectedLang] = useState<Language>('bn');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BDT');

  const currencies = [
    { code: 'BDT', symbol: '৳', flag: '🇧🇩', nameBn: 'Bangladeshi Taka (৳)', nameEn: 'Bangladeshi Taka (৳)' },
    { code: 'INR', symbol: '₹', flag: '🇮🇳', nameBn: 'Indian Rupee (₹)', nameEn: 'Indian Rupee (₹)' },
    { code: 'SAR', symbol: '﷼', flag: '🇸🇦', nameBn: 'Saudi Riyal (﷼)', nameEn: 'Saudi Riyal (﷼)' },
    { code: 'MYR', symbol: 'RM', flag: '🇲🇾', nameBn: 'Malaysian Ringgit (RM)', nameEn: 'Malaysian Ringgit (RM)' },
    { code: 'QAR', symbol: 'QR', flag: '🇶🇦', nameBn: 'Qatari Riyal (QR)', nameEn: 'Qatari Riyal (QR)' },
    { code: 'AED', symbol: 'AED', flag: '🇦🇪', nameBn: 'UAE Dirham (AED)', nameEn: 'UAE Dirham (AED)' },
    { code: 'USD', symbol: '$', flag: '🇺🇸', nameBn: 'US Dollar ($)', nameEn: 'US Dollar ($)' },
    { code: 'GBP', symbol: '£', flag: '🇬🇧', nameBn: 'British Pound (£)', nameEn: 'British Pound (£)' },
  ];

  const handleConfirm = () => {
    onSelect(selectedLang, selectedCurrency);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-[#212124] rounded-[2.5rem] p-6 sm:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-zinc-100 dark:border-[#2C2C30] overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Scrollable Container */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              {/* App Logo */}
              <div className="relative flex justify-center mt-2">
                <div className="relative p-1 bg-white dark:bg-[#2A2A2E] rounded-[1.8rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-zinc-100 dark:border-white/5">
                  <img 
                    src={logo} 
                    alt="Bajar List Logo" 
                    referrerPolicy="no-referrer"
                    className="relative w-16 h-16 rounded-[1.5rem] object-cover"
                  />
                </div>
              </div>
              
              {/* Language Section */}
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                    আপনার ভাষা নির্বাচন করুন
                  </h3>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 font-bold">
                    Select Your Language
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLang('bn')}
                    className={`py-3.5 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                      selectedLang === 'bn'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                        : 'bg-zinc-50 dark:bg-[#2A2A2E] text-zinc-700 dark:text-zinc-300 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-lg">🇧🇩</span>
                    <span>বাংলা</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedLang('en')}
                    className={`py-3.5 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                      selectedLang === 'en'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                        : 'bg-zinc-50 dark:bg-[#2A2A2E] text-zinc-700 dark:text-zinc-300 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-lg">🇺🇸</span>
                    <span>English</span>
                  </button>
                </div>
              </div>

              {/* Currency Section */}
              <div className="space-y-3 border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
                <div className="text-center">
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                    {selectedLang === 'bn' ? 'মুদ্রা নির্বাচন করুন' : 'Select Currency'}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">
                    Choose your default app currency
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 max-h-[30vh] overflow-y-auto pr-1">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setSelectedCurrency(curr.code)}
                      className={`p-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 border text-left cursor-pointer ${
                        selectedCurrency === curr.code
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                          : 'bg-zinc-50 dark:bg-[#2A2A2E] text-zinc-700 dark:text-zinc-300 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{curr.flag}</span>
                      <span className="truncate flex-1">
                        {selectedLang === 'bn' ? curr.nameBn : curr.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action Button at Bottom */}
            <div className="mt-5 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{selectedLang === 'bn' ? 'শুরু করুন' : 'Get Started'}</span>
                <span>🚀</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
