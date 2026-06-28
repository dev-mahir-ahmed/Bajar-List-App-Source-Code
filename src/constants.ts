import { Category, Currency } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '🥦 কাঁচা বাজার', isCustom: false, color: '#4ADE80' },
  { id: '2', name: '🛒 মুদি বাজার', isCustom: false, color: '#FACC15' },
  { id: '3', name: '👕 কাপড়চোপড়', isCustom: false, color: '#60A5FA' },
  { id: '4', name: '💊 ফার্মেসি', isCustom: false, color: '#F87171' },
  { id: '5', name: '📱 ইলেকট্রনিক্স', isCustom: false, color: '#A78BFA' },
  { id: '6', name: '💄 কসমেটিকস', isCustom: false, color: '#F472B6' },
  { id: '7', name: '✏️ লাইব্রেরি', isCustom: false, color: '#FB923C' },
  { id: '8', name: '🍳 রান্নাঘরের জিনিসপত্র', isCustom: false, color: '#94A3B8' },
  { id: '10', name: '📝 অন্যান্য', isCustom: false, color: '#94A3B8' },
];

export const AVAILABLE_CURRENCIES: Currency[] = [
  { code: 'BDT', symbol: '৳', flag: '🇧🇩', nameBn: 'বাংলাদেশী টাকা (৳)', nameEn: 'Bangladeshi Taka (৳)' },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', nameBn: 'ভারতীয় রুপি (₹)', nameEn: 'Indian Rupee (₹)' },
  { code: 'SAR', symbol: '﷼', flag: '🇸🇦', nameBn: 'সৌদি রিয়াল (﷼)', nameEn: 'Saudi Riyal (﷼)' },
  { code: 'MYR', symbol: 'RM', flag: '🇲🇾', nameBn: 'মালয়েশিয়ান রিঙ্গিত (RM)', nameEn: 'Malaysian Ringgit (RM)' },
  { code: 'QAR', symbol: 'QR', flag: '🇶🇦', nameBn: 'কাতারি রিয়াল (QR)', nameEn: 'Qatari Riyal (QR)' },
  { code: 'AED', symbol: 'AED', flag: '🇦🇪', nameBn: 'সংযুক্ত আরব আমিরাত দিরহাম (AED)', nameEn: 'UAE Dirham (AED)' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', nameBn: 'ইউএস ডলার ($)', nameEn: 'US Dollar ($)' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', nameBn: 'ব্রিটিশ পাউন্ড (£)', nameEn: 'British Pound (£)' },
];

export const APP_STORAGE_KEY = 'bazar_list_data';

