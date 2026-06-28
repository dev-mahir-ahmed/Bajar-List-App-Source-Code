import React from 'react';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import profileImg from '../assets/images/profile.jpg.jpg.jpeg';
import { Language } from '../types';

interface DeveloperCardProps {
  language: Language;
  onBack?: () => void;
}

const WhatsAppIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-6 h-6 fill-current" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const DeveloperCard: React.FC<DeveloperCardProps> = ({ language, onBack }) => {
  const titleText = language === 'bn' ? 'ডেভেলপার তথ্য' : 'Developer Information';

  return (
    <div className="pb-6 flex flex-col w-full">
      {/* Premium Android App Bar / Header */}
      <div className="flex items-center gap-4 py-4 mb-6 sticky top-0 bg-[#F8F9FA]/90 dark:bg-[#161619]/90 backdrop-blur-md z-40">
        {onBack && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-11 h-11 bg-white dark:bg-[#212124] rounded-2xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 shadow-sm border border-zinc-150 dark:border-[#2C2C30] hover:bg-zinc-50 dark:hover:bg-[#2A2A2E] transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </motion.button>
        )}
        <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
          {titleText}
        </h1>
      </div>

      {/* Main Container */}
      <div className="space-y-6 w-full">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-[#212124] rounded-[2.5rem] p-6 border border-zinc-100 dark:border-[#2C2C30] shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col items-center text-center overflow-hidden"
        >
          {/* Large Profile Photo Frame */}
          <div className="w-full max-w-[220px] mb-6 px-2">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-[#1A1A1D] border border-zinc-150 dark:border-[#2C2C30] shadow-sm flex items-center justify-center"
            >
              <img 
                src={profileImg} 
                alt="Mahir Ahmed" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Developer Details */}
          <div className="space-y-2 w-full px-4">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Mahir Ahmed
            </h2>
            
            {/* Soft Gradient Role Badge */}
            <div className="inline-flex py-1.5 px-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 text-blue-600 dark:text-blue-400 rounded-full font-black text-[10px] uppercase tracking-wider">
              WEB & APP DEVELOPER
            </div>

          </div>
        </motion.div>

        {/* About Me Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-[#212124] rounded-3xl p-6 border border-zinc-100 dark:border-[#2C2C30] shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-none"
        >
          <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
            About Me
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
            Passionate Web & App Developer focused on building modern, user-friendly, and efficient digital solutions. I enjoy creating responsive websites and mobile applications that deliver a smooth user experience. Currently studying Computer Science and Technology (CST) at Sherpur Polytechnic Institute while continuously improving my development skills and exploring new technologies.
          </p>
        </motion.div>

        {/* Double Contact Buttons Row */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-3 w-full"
        >
          {/* Button 1: Contact Me */}
          <motion.a
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="https://dev-mahir.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm tracking-wide transition-all shadow-[0_4px_12px_rgba(37,99,235,0.15)] flex items-center justify-center gap-2 border border-blue-500/10 cursor-pointer select-none"
          >
            <span>Portfolio</span>
            <ExternalLink size={16} className="opacity-80" />
          </motion.a>

          {/* Button 2: WhatsApp Icon */}
          <motion.a
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/+8801960338442"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(37,211,102,0.15)] cursor-pointer select-none flex-shrink-0"
            title="Chat on WhatsApp"
          >
            <WhatsAppIcon />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};
