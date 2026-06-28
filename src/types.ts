export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  categoryId: string;
  completed: boolean;
  createdAt: number;
  price?: number;
}

export interface Category {
  id: string;
  name: string;
  isCustom: boolean;
  color?: string;
  icon?: string;
}

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  nameBn: string;
  nameEn: string;
}

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'bn' | 'en';

export interface AppData {
  items: ShoppingItem[];
  categories: Category[];
  theme: Theme;
  language: Language;
  currencyCode?: string; 
  isFirstLaunch: boolean;
}

