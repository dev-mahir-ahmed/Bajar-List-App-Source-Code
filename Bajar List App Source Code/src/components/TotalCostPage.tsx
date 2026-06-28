import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Receipt, Trash2, Edit2, Share2, 
  X, Check, ShoppingBag, Calendar, FileText, Plus 
} from 'lucide-react';
import { ShoppingItem, Category, Language } from '../types';
import { Share as CapShare } from '@capacitor/share';
import { getLocalizedCategoryName, getCurrencySymbol } from '../lib/utils';

interface TotalCostPageProps {
  items: ShoppingItem[];
  categories: Category[];
  onUpdatePrice: (id: string, price: number) => void;
  onDelete: (id: string) => void;
  language: Language;
  currencyCode: string;
}

export const TotalCostPage: React.FC<TotalCostPageProps> = ({
  items,
  categories,
  onUpdatePrice,
  onDelete,
  language,
  currencyCode,
}) => {
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editError, setEditError] = useState('');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [pendingSavePrice, setPendingSavePrice] = useState<number | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filter items: completed and having a price
  const costItems = items.filter(item => item.completed && item.price !== undefined && item.price !== null);

  // Calculate total cost
  const totalCost = costItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? getLocalizedCategoryName(cat, language) : (language === 'bn' ? 'অন্যান্য' : 'Others');
  };

  // Convert English numbers to Bengali numerals
  const toBanglaNumber = (num: number | string) => {
    if (language !== 'bn') return num.toString();
    const banglaDigits: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯', '.': '.'
    };
    return num.toString().split('').map(digit => banglaDigits[digit] || digit).join('');
  };

  // Handle opening Edit dialog
  const handleStartEdit = (item: ShoppingItem) => {
    setEditingItem(item);
    setEditPrice(item.price ? item.price.toString() : '');
    setEditError('');
  };

  // Handle saving Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const cleanPrice = editPrice.trim();
    if (!cleanPrice) {
      setEditError(language === 'bn' ? 'মূল্য খালি রাখা যাবে না।' : 'Price cannot be empty.');
      return;
    }

    const parsed = parseFloat(cleanPrice);
    if (isNaN(parsed) || parsed <= 0) {
      setEditError(language === 'bn' ? 'দয়া করে একটি সঠিক সংখ্যা লিখুন।' : 'Please enter a valid positive number.');
      return;
    }

    setPendingSavePrice(parsed);
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    if (editingItem && pendingSavePrice !== null) {
      onUpdatePrice(editingItem.id, pendingSavePrice);
      setEditingItem(null);
    }
    setShowSaveConfirm(false);
    setPendingSavePrice(null);
  };

  const handleCancelSave = () => {
    setShowSaveConfirm(false);
    setPendingSavePrice(null);
  };

  // Toast trigger helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Generate the report text
  const generateShareText = () => {
    const dateStr = new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    let shareText = '';
    const symbol = getCurrencySymbol(currencyCode);
    if (language === 'bn') {
      shareText += `🛒 *আমার বাজার লিস্ট খরচ রিপোর্ট*\n📅 তারিখ: ${dateStr}\n\n`;
      costItems.forEach((item, idx) => {
        shareText += `${toBanglaNumber(idx + 1)}. ${item.name} (${item.quantity || '১টি'}) - ${symbol}${toBanglaNumber(item.price || 0)}\n`;
      });
      shareText += `\n━━━━━━━━━━━━━━━━━━━━\n💰 *মোট বাজার খরচ: ${symbol}${toBanglaNumber(totalCost)}*`;
    } else {
      shareText += `🛒 *My Bazar List Cost Report*\n📅 Date: ${dateStr}\n\n`;
      costItems.forEach((item, idx) => {
        shareText += `${idx + 1}. ${item.name} (${item.quantity || '1 unit'}) - ${symbol}${item.price || 0}\n`;
      });
      shareText += `\n━━━━━━━━━━━━━━━━━━━━\n💰 *Total Shopping Cost: ${symbol}${totalCost}*`;
    }
    return shareText;
  };

  const handleCopyOnly = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      triggerToast(language === 'bn' ? 'সফলভাবে কপি করা হয়েছে!' : 'Successfully Copied!');
    } catch (err) {
      console.warn('Copy error:', err);
    }
    setShowShareModal(false);
  };

  const handleShareOnly = async () => {
    const text = generateShareText();
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        await CapShare.share({
          title: language === 'bn' ? 'বাজার খরচ হিসাব' : 'Shopping Expense Summary',
          text: text,
          dialogTitle: language === 'bn' ? 'শেয়ার করুন' : 'Share Summary',
        });
      } else if (navigator.share) {
        await navigator.share({
          title: language === 'bn' ? 'বাজার খরচ হিসাব' : 'Shopping Expense Summary',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        triggerToast(language === 'bn' ? 'কপি করা হয়েছে!' : 'Copied to clipboard!');
      }
    } catch (err) {
      console.warn('Sharing error:', err);
    }
    setShowShareModal(false);
  };

  return (
    <div className="pb-6 pt-4">
      {/* 1. Header with Title */}
      <div className="flex flex-col items-center mb-6 pt-2">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
          💰 {language === 'bn' ? 'বাজার হিসাব ও মোট খরচ' : 'Shopping Cost Tracker'}
        </h2>
      </div>

      {costItems.length > 0 ? (
        <div className="space-y-5">
          {/* 2. Beautiful Summary Card */}
          <div 
            className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-indigo-900 dark:to-violet-950 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/10 dark:shadow-none"
          >
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
              <span className="text-xs uppercase tracking-widest font-black text-blue-100 dark:text-zinc-400 mb-1">
                {language === 'bn' ? 'মোট বাজার খরচ' : 'Total Shopping Cost'}
              </span>
              <h3 className="text-4xl font-black tracking-tight flex items-center justify-center gap-1">
                <span className="text-3xl font-extrabold">{getCurrencySymbol(currencyCode)}</span>
                {toBanglaNumber(totalCost)}
              </h3>
            </div>
            
            {/* Decorative backgrounds */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
          </div>

          {/* 3. Export & Share Actions */}
          <div>
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-white dark:bg-[#212124] border border-zinc-100 dark:border-[#2C2C30] hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all text-sm cursor-pointer select-none"
            >
              <Share2 size={16} className="text-indigo-500" />
              {language === 'bn' ? 'রিপোর্ট শেয়ার ও কপি' : 'Share & Copy Report'}
            </button>
          </div>

          {/* 4. Cost List items */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 tracking-wider uppercase px-2 mb-1">
              {language === 'bn' ? 'ব্যয়ের আইটেমসমূহ' : 'Expense Items'}
            </h4>
            
            <div className="space-y-2.5">
              {costItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 bg-white dark:bg-[#212124] rounded-2xl border border-zinc-100 dark:border-[#2C2C30] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🛍️</span>
                    <div>
                      <h5 className="font-bold text-zinc-800 dark:text-zinc-100 text-[14px] leading-tight">
                        {item.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.quantity && (
                          <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
                            {item.quantity}
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800/50">
                          {getCategoryName(item.categoryId)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 block leading-none mb-0.5">
                        {language === 'bn' ? 'মূল্য' : 'Price'}
                      </span>
                      <span className="font-black text-zinc-800 dark:text-zinc-100 text-[15px] leading-none">
                        {getCurrencySymbol(currencyCode)}{toBanglaNumber(item.price || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all cursor-pointer"
                        title={language === 'bn' ? 'মূল্য সংশোধন' : 'Edit Price'}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                        title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 5. Clean Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-zinc-100 dark:bg-[#212124] rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">💰</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
            {language === 'bn' ? 'কোনো খরচ নেই' : 'No Expenses Yet'}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 max-w-[220px] leading-relaxed">
            {language === 'bn' 
              ? 'এখনও কোনো বাজারের খরচ যোগ করা হয়নি।'
              : 'No shopping expenses have been tracked yet.'}
          </p>
        </div>
      )}

      {/* 6. Edit Price Prompt Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#212124] rounded-3xl p-6 shadow-2xl border border-zinc-100 dark:border-[#2C2C30] mx-2 z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>✏️</span> {language === 'bn' ? 'মূল্য সংশোধন করুন' : 'Edit Price'}
                </h3>
                <button 
                  onClick={() => setEditingItem(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 mb-3 leading-snug">
                    {language === 'bn' 
                      ? `"${editingItem.name}" পণ্যটির নতুন ক্রয়মূল্য লিখুন:`
                      : `Enter new purchase price for "${editingItem.name}":`}
                  </p>

                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-zinc-500 dark:text-zinc-400 font-bold text-lg select-none">{getCurrencySymbol(currencyCode)}</span>
                    <input
                      autoFocus
                      type="number"
                      step="any"
                      min="0.01"
                      value={editPrice}
                      onChange={(e) => {
                        setEditPrice(e.target.value);
                        if (editError) setEditError('');
                      }}
                      placeholder={language === 'bn' ? 'মূল্য' : 'Price amount'}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-[#2A2A2E] border-none rounded-xl focus:ring-2 focus:ring-blue-500/30 dark:text-white outline-none font-black text-lg"
                    />
                  </div>

                  {editError && (
                    <p className="text-red-500 text-xs font-bold mt-2">
                      ⚠️ {editError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-1.5 text-sm"
                  >
                    <Check size={16} />
                    {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Confirmation Modal */}
      <AnimatePresence>
        {showSaveConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelSave}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#212124] rounded-3xl p-6 shadow-2xl border border-zinc-100 dark:border-[#2C2C30]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">💾</span>
                </div>
                
                <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                  {language === 'bn' ? 'পরিবর্তন সংরক্ষণ' : 'Save Changes'}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                  {language === 'bn' 
                    ? 'আপনি কি সত্যিই এই পরিবর্তনগুলো সংরক্ষণ করতে চান?' 
                    : 'Are you sure you want to save these changes?'}
                </p>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={handleCancelSave}
                    className="px-6 py-3 bg-zinc-100 dark:bg-[#2A2A2E] text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-[#2A2A2E]/80 transition-colors text-sm cursor-pointer"
                  >
                    {language === 'bn' ? 'না' : 'No'}
                  </button>
                  <button
                    onClick={handleConfirmSave}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-sm hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                  >
                    {language === 'bn' ? 'হ্যাঁ, সংরক্ষণ করুন' : 'Yes, Save Changes'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleCancelSave}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share & Copy Action Sheet */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[180] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#212124] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl border-t border-zinc-100 dark:border-[#2C2C30] sm:border z-[190]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>📤</span> {language === 'bn' ? 'রিপোর্ট শেয়ার ও কপি' : 'Share & Copy Report'}
                </h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Copy Button */}
                <button
                  onClick={handleCopyOnly}
                  className="flex flex-col items-center justify-center gap-3 p-5 bg-zinc-50 dark:bg-[#2A2A2E] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-3xl transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <FileText size={22} />
                  </div>
                  <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                    {language === 'bn' ? 'কপি করুন' : 'Copy Text'}
                  </span>
                </button>

                {/* Native Share Button */}
                <button
                  onClick={handleShareOnly}
                  className="flex flex-col items-center justify-center gap-3 p-5 bg-zinc-50 dark:bg-[#2A2A2E] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-3xl transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Share2 size={22} />
                  </div>
                  <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                    {language === 'bn' ? 'শেয়ার করুন' : 'Share'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[250] bg-zinc-900/95 dark:bg-white/95 text-white dark:text-zinc-950 font-bold text-sm py-3 px-6 rounded-2xl shadow-xl flex items-center gap-2 border border-zinc-800 dark:border-zinc-200"
          >
            <span>✨</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
