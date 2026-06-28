import React, { useState } from 'react';
import { 
  Moon, Sun, Plus, Trash2, Globe, 
  Palette, ShieldCheck, ChevronRight, Laptop,
  X, FileText, Calendar, Users, Facebook, Share2,
  LayoutGrid, Coins, Play
} from 'lucide-react';
import { Share as CapShare } from '@capacitor/share';
import { Category, Theme, Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../lib/translations';
import { AVAILABLE_CURRENCIES } from '../constants';
import { getCurrencySymbol } from '../lib/utils';
import logo from '../assets/images/bajar_list_logo.png';

interface SettingsPageProps {
  categories: Category[];
  theme: Theme;
  language: Language;
  currencyCode: string;
  onAddCategory: (name: string, icon?: string) => void;
  onDeleteCategory: (id: string) => void;
  onSetTheme: (theme: Theme) => void;
  onSetLanguage: (lang: Language) => void;
  onSetCurrencyCode: (code: string) => void;
  onExport: () => void;
  onImport: (data: string) => void;
  activeModal?: string | null;
  setActiveModal?: (id: string | null) => void;
}


const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className="fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface SettingsModalProps {
  id: string;
  activeModal: string | null;
  setActiveModal: (id: string | null) => void;
  title: string;
  children: React.ReactNode;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ id, activeModal, setActiveModal, title, children }) => (
  <AnimatePresence>
    {activeModal === id && (
      <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveModal(null)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-[#212124] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border-t border-zinc-100 dark:border-[#2C2C30] sm:border"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">{title}</h2>
            <button 
              onClick={() => setActiveModal(null)}
              className="w-10 h-10 bg-zinc-200/60 dark:bg-[#2A2A2E] rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({
  categories,
  theme,
  language,
  currencyCode,
  onAddCategory,
  onDeleteCategory,
  onSetTheme,
  onSetLanguage,
  onSetCurrencyCode,
  onExport,
  onImport,
  activeModal: externalActiveModal,
  setActiveModal: externalSetActiveModal,
}) => {
  const _unusedCompatProps = { onExport, onImport };

  const [internalActiveModal, internalSetActiveModal] = useState<string | null>(null);
  const isControlled = externalActiveModal !== undefined && externalSetActiveModal !== undefined;

  const activeModal = isControlled ? externalActiveModal : internalActiveModal;
  const setActiveModal = isControlled ? externalSetActiveModal : internalSetActiveModal;

  const [newCatName, setNewCatName] = useState('');
  const [selectedPresetEmoji, setSelectedPresetEmoji] = useState('🥬');
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = translations[language];

  const handleAddCategory = () => {
    if (newCatName.trim()) {
      const finalEmoji = customEmojiInput.trim() || selectedPresetEmoji;
      onAddCategory(newCatName.trim(), finalEmoji);
      setNewCatName('');
      setCustomEmojiInput('');
      setSelectedPresetEmoji('🥬');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleShareApp = async () => {
    const shareTitle = 'বাজার লিস্ট';
    const shareText = language === 'bn' 
      ? `প্রতিদিনের বাজার করার জন্য বা কী কী বাজার করতে হবে তার তালিকা রাখার জন্য "বাজার লিস্ট" একটি দারুণ অ্যাপ। আমি নিজেও এটি ব্যবহার করছি এবং এটি দৈনন্দিন বাজারের পরিকল্পনা করতে অনেক সাহায্য করে।`
      : `Bajar List is an amazing app to maintain and organize your daily grocery shopping list. I am using it myself and it helps a lot in planning daily groceries.`;
    const shareUrl = 'https://bajar-list-app.vercel.app/';

    try {
      // Try Capacitor Share first
      await CapShare.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
        dialogTitle: language === 'bn' ? 'অ্যাপ শেয়ার করুন' : 'Share App',
      });
    } catch (capError) {
      console.log('Capacitor share failed, trying Web Share API:', capError);
      // Fallback 1: Web Share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: `${shareText}\n\n${language === 'bn' ? 'অ্যাপ ডাউনলোড করুন:' : 'Download App:'}\n${shareUrl}`,
          });
        } catch (webShareError) {
          console.log('Web share failed, copying to clipboard instead:', webShareError);
          fallbackCopyToClipboard(`${shareText}\n\n${language === 'bn' ? 'অ্যাপ ডাউনলোড করুন:' : 'Download App:'}\n${shareUrl}`);
        }
      } else {
        // Fallback 2: Clipboard copy
        fallbackCopyToClipboard(`${shareText}\n\n${language === 'bn' ? 'অ্যাপ ডাউনলোড করুন:' : 'Download App:'}\n${shareUrl}`);
      }
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      showToast(language === 'bn' ? 'শেয়ারের লেখাটি ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Share text copied to clipboard!');
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  };

  // Helper to get current month/year dynamically matching the reference image style
  const getCurrentDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    
    if (language === 'bn') {
      const bnMonths = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const getBengaliNumber = (num: number) => 
        String(num).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
      
      return `${bnMonths[monthIndex]} ${getBengaliNumber(year)}`;
    } else {
      const enMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${enMonths[monthIndex]} ${year}`;
    }
  };

  // Groups Definition
  const groups = [
    {
      title: language === 'bn' ? 'অ্যাকাউন্ট সেটিংস' : 'Account Settings',
      items: [
        {
          id: 'language',
          icon: Globe,
          title: t.language,
          desc: language === 'bn' ? 'অ্যাপের ভাষা পরিবর্তন করুন (বাংলা/English)' : 'Change the application language',
          color: 'bg-blue-50 text-blue-600 dark:bg-[#2A2A2E] dark:text-blue-400',
          badge: language === 'bn' ? 'বাংলা' : 'English',
        },
        {
          id: 'theme',
          icon: Palette,
          title: t.appTheme,
          desc: language === 'bn' ? 'লাইট বা ডার্ক থিম সিলেক্ট করুন' : 'Choose light, dark or device theme',
          color: 'bg-orange-50 text-orange-600 dark:bg-[#2A2A2E] dark:text-orange-400',
          badge: theme === 'light' ? t.lightMode : theme === 'dark' ? t.darkMode : t.systemMode,
        },
        {
          id: 'currency',
          icon: Coins,
          title: language === 'bn' ? 'মুদ্রা নির্বাচন' : 'Select Currency',
          desc: language === 'bn' ? 'টাকা, রুপি, ডলার বা অন্য কোনো মুদ্রা নির্বাচন করুন' : 'Select currency like Taka, Rupee, Dollar, etc.',
          color: 'bg-amber-50 text-amber-600 dark:bg-[#2A2A2E] dark:text-amber-400',
          badge: `${currencyCode} (${getCurrencySymbol(currencyCode)})`,
        },
        {
          id: 'category',
          icon: Plus,
          title: t.customCategory,
          desc: language === 'bn' ? 'আপনার নিজের পছন্দের বাজার ক্যাটাগরি যোগ করুন' : 'Add and customize your grocery categories',
          color: 'bg-emerald-50 text-emerald-600 dark:bg-[#2A2A2E] dark:text-emerald-400',
        }
      ]
    },
    {
      title: language === 'bn' ? 'কমিউনিটি ও সাপোর্ট' : 'Community & Support',
      items: [
        {
          id: 'facebook_group',
          icon: Users,
          title: language === 'bn' ? 'ফেসবুক গ্রুপে যুক্ত হন' : 'Join Facebook Group',
          desc: language === 'bn' ? 'আমাদের সক্রিয় ফেসবুক গ্রুপ কমিউনিটিতে যোগ দিন।' : 'Join our active Facebook group community.',
          color: 'bg-blue-50 text-blue-600 dark:bg-[#2A2A2E] dark:text-blue-400',
          url: 'https://www.facebook.com/groups/1007018411811074'
        },
        {
          id: 'facebook_page',
          icon: Facebook,
          title: language === 'bn' ? 'ফেসবুক পেজ ফলো করুন' : 'Follow Facebook Page',
          desc: language === 'bn' ? 'নতুন আপডেট ও ঘোষণা পান।' : 'Get new updates and announcements.',
          color: 'bg-sky-50 text-sky-600 dark:bg-[#2A2A2E] dark:text-sky-400',
          url: 'https://www.facebook.com/profile.php?id=61590969921257'
        },
        {
          id: 'app_usage_guide',
          icon: Play,
          title: language === 'bn' ? 'অ্যাপ ব্যবহারের নির্দেশিকা' : 'App Usage Guide',
          desc: language === 'bn' ? 'ভিডিও দেখে সহজে অ্যাপের সকল ফিচার ব্যবহার করা শিখুন।' : 'Learn how to use all features easily by watching the video.',
          color: 'bg-red-50 text-red-600 dark:bg-[#2A2A2E] dark:text-red-400',
          url: 'https://www.facebook.com/share/v/18uX175nMV/'
        },
        {
          id: 'other_apps',
          icon: LayoutGrid,
          title: language === 'bn' ? 'অন্যান্য অ্যাপসমূহ' : 'Other Apps',
          desc: language === 'bn' ? 'ডেভেলপার মাহিরের তৈরি অন্যান্য আকর্ষণীয় অ্যাপস।' : 'Other amazing apps developed by Mahir.',
          color: 'bg-purple-50 text-purple-600 dark:bg-[#2A2A2E] dark:text-purple-400',
          url: 'https://dev-mahir-all-apps.vercel.app/'
        },
        {
          id: 'live_chat',
          icon: WhatsAppIcon,
          title: language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat',
          desc: language === 'bn' ? 'অ্যাপে কোনো সমস্যা, নতুন ফিচারের পরামর্শ বা যেকোনো প্রয়োজন হলে ডেভেলপারকে জানান।' : 'Contact the developer for any issues, feature suggestions or needs.',
          color: 'bg-green-50 text-green-600 dark:bg-[#2A2A2E] dark:text-green-400',
          url: 'https://wa.me/+8801960338442'
        }
      ]
    },
    {
      title: language === 'bn' ? 'প্রাইভেসি' : 'Privacy',
      items: [
        {
          id: 'privacy_policy',
          icon: ShieldCheck,
          title: language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy',
          desc: language === 'bn' ? 'অ্যাপের গোপনীয়তা নীতি পড়ুন।' : 'Read our privacy policy.',
          color: 'bg-teal-50 text-teal-600 dark:bg-[#2A2A2E] dark:text-teal-400',
          url: 'https://bajar-list-app.vercel.app/privacy-policy.html'
        },
        {
          id: 'terms_conditions',
          icon: FileText,
          title: language === 'bn' ? 'টার্মস অ্যান্ড কন্ডিশন' : 'Terms & Conditions',
          desc: language === 'bn' ? 'ব্যবহারের শর্তাবলী পড়ুন।' : 'Read our terms and conditions.',
          color: 'bg-purple-50 text-purple-600 dark:bg-[#2A2A2E] dark:text-purple-400',
          url: 'https://bajar-list-app.vercel.app/terms-and-conditions.html'
        },
        {
          id: 'share_app',
          icon: Share2,
          title: language === 'bn' ? 'অ্যাপ শেয়ার করুন' : 'Share App',
          desc: language === 'bn' ? 'বন্ধুদের সাথে অ্যাপটি শেয়ার করুন।' : 'Share the app with friends.',
          color: 'bg-rose-50 text-rose-600 dark:bg-[#2A2A2E] dark:text-rose-400',
          onClick: handleShareApp
        }
      ]
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      setActiveModal(item.id);
    }
  };

  return (
    <div className="pb-6 px-1">
      {/* Top Header redesign matching reference image layout */}
      <div className="flex items-center justify-between mb-8 px-2 mt-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 bg-white dark:bg-[#212124] rounded-[1.25rem] shadow-[0_10px_25px_rgba(0,0,0,0.03)] border border-zinc-100 dark:border-[#2C2C30] p-1 flex-shrink-0 flex items-center justify-center">
            <img 
              src={logo} 
              alt="Bajar List Logo" 
              className="w-full h-full object-contain rounded-[1.05rem]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-1">
              {t.appName}
            </h1>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wide">
              {language === 'bn' ? 'আপনার ডিজিটাল শপিং লিস্ট অ্যাসিস্ট্যান্ট' : 'Your digital shopping partner'}
            </p>
          </div>
        </div>

        {/* Date badge on the right side */}
        <div className="flex items-center gap-1.5 border border-zinc-150 dark:border-[#2C2C30] bg-white dark:bg-[#212124] px-4 py-2.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-zinc-700 dark:text-zinc-300 text-xs font-extrabold flex-shrink-0">
          <Calendar size={14} className="text-blue-500" />
          <span>{getCurrentDateString()}</span>
        </div>
      </div>

      {/* Settings Options Grouped into separation cards */}
      <div className="space-y-4">
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <h3 className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 tracking-wider uppercase px-3">
              {group.title}
            </h3>
            
            <div className="bg-white dark:bg-[#212124] rounded-3xl border border-zinc-100 dark:border-[#2C2C30] shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-[#2C2C30]">
              {group.items.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ backgroundColor: "rgba(244, 244, 245, 0.3)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center justify-between py-3 px-4 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-[14px] leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-tight font-medium mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0 text-zinc-400 dark:text-zinc-500">
                    {item.badge && (
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-[#2A2A2E] dark:text-blue-400 py-1 px-2.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={16} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Language Modal */}
      <SettingsModal id="language" activeModal={activeModal} setActiveModal={setActiveModal} title={t.language}>
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'bn', label: 'বাংলা' },
            { id: 'en', label: 'English' }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => { onSetLanguage(lang.id as Language); setActiveModal(null); }}
              className={`flex items-center justify-between p-5 rounded-2xl transition-all cursor-pointer ${
                language === lang.id 
                  ? 'bg-blue-600 text-white shadow-md font-black' 
                  : 'bg-white dark:bg-[#2A2A2E] text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-100 dark:border-[#2C2C30] hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-[15px]">{lang.label}</span>
              {language === lang.id && <ShieldCheck size={20} />}
            </button>
          ))}
        </div>
      </SettingsModal>

      {/* Theme Modal */}
      <SettingsModal id="theme" activeModal={activeModal} setActiveModal={setActiveModal} title={t.appTheme}>
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'light', label: t.lightMode, icon: Sun, color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' },
            { id: 'dark', label: t.darkMode, icon: Moon, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' },
            { id: 'system', label: t.systemMode, icon: Laptop, color: 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => { onSetTheme(mode.id as Theme); setActiveModal(null); }}
              className={`flex items-center justify-between p-5 rounded-2xl transition-all cursor-pointer ${
                theme === mode.id 
                  ? 'bg-orange-500 text-white shadow-md font-black' 
                  : 'bg-white dark:bg-[#2A2A2E] text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-100 dark:border-[#2C2C30] hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme === mode.id ? 'bg-white/20 text-white' : mode.color.replace('dark:bg-orange-500/10', 'dark:bg-[#1E1E22]').replace('dark:bg-indigo-500/10', 'dark:bg-[#1E1E22]').replace('dark:bg-slate-500/10', 'dark:bg-[#1E1E22]')}`}>
                  <mode.icon size={18} />
                </div>
                <span className="text-[15px]">{mode.label}</span>
              </div>
              {theme === mode.id && <ShieldCheck size={20} />}
            </button>
          ))}
        </div>
      </SettingsModal>

      {/* Currency Modal */}
      <SettingsModal id="currency" activeModal={activeModal} setActiveModal={setActiveModal} title={language === 'bn' ? 'মুদ্রা নির্বাচন করুন' : 'Select Currency'}>
        <div className="grid grid-cols-1 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {AVAILABLE_CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              onClick={() => { onSetCurrencyCode(curr.code); setActiveModal(null); }}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${
                currencyCode === curr.code 
                  ? 'bg-amber-500 text-white shadow-md font-black' 
                  : 'bg-white dark:bg-[#2A2A2E] text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-100 dark:border-[#2C2C30] hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-xl flex-shrink-0">{curr.flag}</span>
                <span className="text-[14px]">{language === 'bn' ? curr.nameBn : curr.nameEn}</span>
              </div>
              {currencyCode === curr.code && <ShieldCheck size={20} />}
            </button>
          ))}
        </div>
      </SettingsModal>

      {/* Category Modal */}
      <SettingsModal id="category" activeModal={activeModal} setActiveModal={setActiveModal} title={t.customCategory}>
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1.5 custom-scrollbar">
          {/* Category Name Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {language === 'bn' ? 'ক্যাটাগরির নাম' : 'Category Name'}
            </label>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder={t.newCategoryName}
              className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-[#2A2A2E] rounded-2xl outline-none border border-zinc-100 dark:border-[#2C2C30] focus:border-blue-500 dark:text-white font-bold shadow-sm text-sm"
            />
          </div>

          {/* Emoji Selection Grid */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {language === 'bn' ? 'ইমোজি নির্বাচন করুন' : 'Select Emoji'}
            </label>
            <div className="grid grid-cols-6 gap-2 bg-zinc-50 dark:bg-[#1C1C1E] p-3 rounded-2xl border border-zinc-100 dark:border-[#2C2C30]">
              {['🥬', '🥩', '🍎', '🧅', '🍞', '🧀', '🥛', '🧴', '🍗', '🐟', '🍚', '🛒', '🥤', '🍌', '🌶️', '🥚', '🧼', '🍪'].map((emoji) => {
                const isSelected = selectedPresetEmoji === emoji && !customEmojiInput.trim();
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setSelectedPresetEmoji(emoji);
                      setCustomEmojiInput('');
                    }}
                    className={`h-10 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md scale-110'
                        : 'bg-white dark:bg-[#2A2A2E] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-[#2C2C30]'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Emoji Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {language === 'bn' ? 'কাস্টম ইমোজি (ঐচ্ছিক)' : 'Custom Emoji (Optional)'}
            </label>
            <input
              type="text"
              value={customEmojiInput}
              onChange={(e) => setCustomEmojiInput(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: 🍇' : 'e.g. 🍇'}
              className="w-full px-5 py-3 bg-zinc-50 dark:bg-[#2A2A2E] rounded-2xl outline-none border border-zinc-100 dark:border-[#2C2C30] focus:border-blue-500 dark:text-white font-bold shadow-sm text-center text-lg"
              maxLength={5}
            />
          </div>

          {/* Add Category Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddCategory}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition-colors cursor-pointer text-sm"
          >
            <Plus size={18} />
            {t.add}
          </motion.button>
          
          {/* Custom Categories List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar pt-1">
            {categories.filter(c => c.isCustom).map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-4 bg-white dark:bg-[#2A2A2E] rounded-2xl border border-zinc-100 dark:border-[#2C2C30] shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon || '🛍️'}</span>
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                    {cat.icon && cat.name.startsWith(cat.icon) ? cat.name.slice(cat.icon.length).trim() : cat.name}
                  </span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => onDeleteCategory(cat.id)} 
                  className="text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            ))}
            {categories.filter(c => c.isCustom).length === 0 && (
              <p className="text-sm text-zinc-400 italic text-center py-6">{t.noCustomCategories}</p>
            )}
          </div>
        </div>
      </SettingsModal>

      {/* Premium Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 bg-zinc-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-900 text-xs font-black rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-md border border-white/10"
          >
            <span>✨</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
