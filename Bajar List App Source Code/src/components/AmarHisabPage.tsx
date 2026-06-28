import React from 'react';
import { motion } from 'motion/react';
import { Receipt, CheckCircle2, Download, ArrowRight, LayoutDashboard, Wallet, ShoppingCart, History } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';
import amarHisabLogo from '../assets/images/amar-hisab-logo.png';

interface AmarHisabPageProps {
  language: Language;
}

export const AmarHisabPage: React.FC<AmarHisabPageProps> = ({ language }) => {
  const t = translations[language];

  const features = [
    { icon: <ShoppingCart size={20} />, text: language === 'bn' ? 'বাজারের খরচ লিখে রাখতে পারবেন' : 'You can write market expenses' },
    { icon: <History size={20} />, text: language === 'bn' ? 'মাসিক হিসাব সংরক্ষণ করতে পারবেন' : 'You can store monthly accounts' },
    { icon: <Wallet size={20} />, text: language === 'bn' ? 'দৈনিক আয়-ব্যয়ের হিসাব রাখতে পারবেন' : 'You can keep daily income-expenses' },
    { icon: <LayoutDashboard size={20} />, text: language === 'bn' ? 'প্রয়োজনীয় খরচগুলো ট্র্যাক করতে পারবেন' : 'You can track necessary expenses' },
    { icon: <CheckCircle2 size={20} />, text: language === 'bn' ? 'সহজ ও সুন্দর বাংলা ইন্টারফেস ব্যবহার করতে পারবেন' : 'You can use a simple and beautiful Interface' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-6 pt-4"
    >
      {/* App Logo Section */}
      <div className="flex flex-col items-center mb-10 pt-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-24 h-24 bg-white dark:bg-[#212124] rounded-[2rem] flex items-center justify-center shadow-md border border-zinc-100 dark:border-[#2C2C30] mb-6 overflow-hidden p-4"
        >
          {/* App Logo from local assets */}
          <img 
            src={amarHisabLogo} 
            alt="Amar Hisab Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              // If image fails to load (e.g. offline or broken asset), 
              // we hide the image and let the container show a CSS-based icon 
              // or just avoid showing a broken image icon.
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'w-full h-full flex items-center justify-center bg-indigo-500 rounded-full text-white font-black text-2xl';
                fallback.innerText = 'AH';
                parent.appendChild(fallback);
              }
            }}
          />
        </motion.div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
          🧾 {t.hisab}
        </h2>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10">
          <p className="text-indigo-50/90 leading-relaxed text-lg font-medium">
            {t.description}
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#212124] rounded-3xl p-6 border border-zinc-100 dark:border-[#2C2C30] shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            {language === 'bn' ? (
              <>তাহলে এখনই ব্যবহার করুন <span className="text-indigo-500">"আমার হিসাব"</span> অ্যাপ।</>
            ) : (
              <>So use the <span className="text-indigo-500">"Amar Hisab"</span> app now.</>
            )}
          </h2>
          
          <div className="space-y-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-[#2A2A2E] transition-colors group"
              >
                <div className="mt-0.5 p-2 bg-indigo-50 dark:bg-[#2A2A2E] text-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <span className="text-zinc-600 dark:text-zinc-300 font-medium pt-1">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="bg-indigo-50 dark:bg-[#212124] rounded-3xl p-6 border border-indigo-100 dark:border-[#2C2C30]">
          <p className="text-indigo-700 dark:text-indigo-400 font-bold text-center flex items-center justify-center gap-2">
            <span className="text-xl">📊</span>
            {language === 'bn' 
              ? 'আপনার সকল হিসাব এখন থাকবে এক জায়গায়, সহজভাবে এবং ঝামেলাহীনভাবে।'
              : 'All your accounts will now be in one place, simply and hassle-free.'}
          </p>
        </div>

        {/* Action Button */}
        <a
          href="https://play.google.com/store/apps/details?id=com.mahirhisab.app"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 text-xl"
          >
            <Download size={24} />
            {t.download}
            <ArrowRight size={20} className="opacity-50" />
          </motion.button>
        </a>
      </div>
    </motion.div>
  );
};
