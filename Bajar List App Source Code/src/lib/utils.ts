import { Category, Language } from '../types';
import { AVAILABLE_CURRENCIES } from '../constants';

export const getLocalizedCategoryName = (category: Category, language: Language): string => {
  if (category.isCustom) {
    return category.name;
  }
  
  if (language === 'bn') {
    switch (category.id) {
      case '1': return '🥦 কাঁচা বাজার';
      case '2': return '🛒 মুদি বাজার';
      case '3': return '👕 কাপড়চোপড়';
      case '4': return '💊 ফার্মেসি';
      case '5': return '📱 ইলেকট্রনিক্স';
      case '6': return '💄 কসমেটিকস';
      case '7': return '✏️ লাইব্রেরি';
      case '8': return '🍳 রান্নাঘরের জিনিসপত্র';
      case '10': return '📝 অন্যান্য';
      default: return category.name;
    }
  } else {
    switch (category.id) {
      case '1': return '🥦 Fresh Market';
      case '2': return '🛒 Grocery';
      case '3': return '👕 Clothing';
      case '4': return '💊 Pharmacy';
      case '5': return '📱 Electronics';
      case '6': return '💄 Cosmetics';
      case '7': return '✏️ Stationery';
      case '8': return '🍳 Kitchen Items';
      case '10': return '📝 Others';
      default: return category.name;
    }
  }
};

export const getCurrencySymbol = (code: string): string => {
  const currency = AVAILABLE_CURRENCIES.find(c => c.code === code);
  return currency ? currency.symbol : '৳';
};

