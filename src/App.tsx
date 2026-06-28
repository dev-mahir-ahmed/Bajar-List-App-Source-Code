import { useState, useEffect, useRef } from 'react';
import { useBazarData } from './hooks/useBazarData';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { AddItemModal } from './components/AddItemModal';
import { CategorySection } from './components/CategorySection';
import { SettingsPage } from './components/SettingsPage';
import { DeveloperCard } from './components/DeveloperCard';
import { ConfirmModal } from './components/ConfirmModal';
import { ExitConfirmModal } from './components/ExitConfirmModal';
import { AmarHisabPage } from './components/AmarHisabPage';
import { LanguagePopup } from './components/LanguagePopup';
import { PricePromptModal } from './components/PricePromptModal';
import { TotalCostPage } from './components/TotalCostPage';
import { FinalConfirmModal } from './components/FinalConfirmModal';
import { TutorialPopup } from './components/TutorialPopup';
import { ShoppingItem } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';
import { translations } from './lib/translations';
import { App as CapApp } from '@capacitor/app';

export default function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'hisab' | 'settings' | 'developer'>('list');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [settingsModalId, setSettingsModalId] = useState<string | null>(null);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [priceItem, setPriceItem] = useState<ShoppingItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);
  const [tutorialDismissed, setTutorialDismissed] = useState<boolean>(() => {
    return localStorage.getItem('tutorialDismissed') === 'true';
  });
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const {
    items,
    categories,
    theme,
    language,
    currencyCode,
    isFirstLaunch,
    addItem,
    toggleItem,
    setItemPriceAndCompleted,
    updateItemPrice,
    deleteItem,
    clearAllItems,
    addCategory,
    deleteCategory,
    setTheme,
    setLanguage,
    setCurrencyCode,
    setFirstLaunchComplete,
    exportData,
    importData,
  } = useBazarData();

  const handleToggleItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      if (item.completed) {
        toggleItem(id);
      } else {
        if (item.price !== undefined && item.price !== null && !isNaN(item.price)) {
          toggleItem(id);
        } else {
          setPriceItem(item);
        }
      }
    }
  };

  const stateRef = useRef({
    activeTab,
    isAddItemOpen,
    isConfirmOpen,
    settingsModalId,
    isExitConfirmOpen,
  });

  useEffect(() => {
    stateRef.current = {
      activeTab,
      isAddItemOpen,
      isConfirmOpen,
      settingsModalId,
      isExitConfirmOpen,
    };
  }, [activeTab, isAddItemOpen, isConfirmOpen, settingsModalId, isExitConfirmOpen]);

  // Reset scroll position to top when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isFirstLaunch && !tutorialDismissed) {
      setIsTutorialOpen(true);
    }
  }, [isFirstLaunch, tutorialDismissed]);

  useEffect(() => {
    let backButtonListener: any = null;

    const setupListener = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          backButtonListener = await CapApp.addListener('backButton', () => {
            const {
              activeTab: currentTab,
              isAddItemOpen: addOpen,
              isConfirmOpen: confirmOpen,
              settingsModalId: settingsOpen,
              isExitConfirmOpen: exitOpen,
            } = stateRef.current;

            if (addOpen) {
              setIsAddItemOpen(false);
              return;
            }
            if (confirmOpen) {
              setIsConfirmOpen(false);
              return;
            }
            if (settingsOpen) {
              setSettingsModalId(null);
              return;
            }
            if (exitOpen) {
              setIsExitConfirmOpen(false);
              return;
            }
            if (currentTab !== 'list') {
              setActiveTab('list');
              return;
            }
            setIsExitConfirmOpen(true);
          });
        }
      } catch (err) {
        console.warn('Failed to register Capacitor backButton listener:', err);
      }
    };

    setupListener();

    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, []);

  const t = translations[language];

  // Sort items: incomplete first, then complete. Within those, newest first.
  const sortedItems = Array.isArray(items) ? [...items].sort((a, b) => {
    if (a.completed === b.completed) {
      return (b.createdAt || 0) - (a.createdAt || 0);
    }
    return a.completed ? 1 : -1;
  }) : [];

  const groupedItems = Array.isArray(categories) ? categories.map((cat) => {
    const categoryItems = sortedItems.filter((item) => item.categoryId === cat.id);
    const isAllCompleted = categoryItems.length > 0 && categoryItems.every(item => item.completed);
    return {
      category: cat,
      items: categoryItems,
      isAllCompleted
    };
  })
  .filter(group => group.items.length > 0)
  .sort((a, b) => {
    if (a.isAllCompleted === b.isAllCompleted) return 0;
    return a.isAllCompleted ? 1 : -1;
  }) : [];

  const handleFirstLaunchSelect = (lang: any, currency: string) => {
    setLanguage(lang);
    setCurrencyCode(currency);
    setFirstLaunchComplete();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#161619] transition-colors duration-300 pb-24">
      <LanguagePopup isOpen={isFirstLaunch} onSelect={handleFirstLaunchSelect} />
      <TutorialPopup
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onPermanentlyDismiss={() => {
          localStorage.setItem('tutorialDismissed', 'true');
          setTutorialDismissed(true);
          setIsTutorialOpen(false);
        }}
        language={language}
      />

      <div className="max-w-md mx-auto px-6 pt-6">
        <AnimatePresence mode="popLayout">
          {activeTab === 'list' && (
            <div key="list">
              <div className="flex flex-col items-center mb-4">
                <Header language={language} />
                {items.length > 0 && (
                  <button
                    onClick={() => setIsConfirmOpen(true)}
                    className="mt-2 flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold border border-transparent hover:border-red-100 dark:hover:border-red-500/20 shadow-sm hover:shadow-md"
                  >
                    <Trash2 size={16} />
                    {t.deleteAll}
                  </button>
                )}
              </div>
              
               {groupedItems.length > 0 ? (
                <div className="space-y-2">
                  {groupedItems.map((group) => (
                    <CategorySection
                      key={group.category.id}
                      category={group.category}
                      items={group.items}
                      onToggle={handleToggleItem}
                      onDelete={(id) => setDeleteConfirmId(id)}
                      language={language}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-24 h-24 bg-zinc-100 dark:bg-[#212124] rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🛍️</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t.emptyListTitle}</h2>
                  <p className="text-zinc-500 dark:text-zinc-500 max-w-[200px]">{t.emptyListSub}</p>
                </div>
              )}

               <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => setIsFinalConfirmOpen(true)}
                title={t.deleteAllTitle}
                message={t.deleteAllMessage}
                confirmText={t.confirm}
                cancelText={t.cancel}
              />



              <FinalConfirmModal
                isOpen={isFinalConfirmOpen}
                onClose={() => setIsFinalConfirmOpen(false)}
                onConfirm={clearAllItems}
                language={language}
              />

              <PricePromptModal
                item={priceItem}
                isOpen={priceItem !== null}
                onClose={() => setPriceItem(null)}
                onSave={(id, price) => setItemPriceAndCompleted(id, price, true)}
                language={language}
                currencyCode={currencyCode}
              />
            </div>
          )}


          {activeTab === 'hisab' && (
            <div key="hisab">
              <TotalCostPage
                items={items}
                categories={categories}
                onUpdatePrice={updateItemPrice}
                onDelete={(id) => setDeleteConfirmId(id)}
                language={language}
                currencyCode={currencyCode}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div key="settings">
              <SettingsPage
                categories={categories}
                theme={theme}
                language={language}
                currencyCode={currencyCode}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
                onSetTheme={setTheme}
                onSetLanguage={setLanguage}
                onSetCurrencyCode={setCurrencyCode}
                onExport={exportData}
                onImport={importData}
                activeModal={settingsModalId}
                setActiveModal={setSettingsModalId}
              />
            </div>
          )}

          {activeTab === 'developer' && (
            <div key="developer">
              <DeveloperCard language={language} onBack={() => setActiveTab('list')} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {activeTab === 'list' && (
        <AddItemModal
          categories={categories}
          onAdd={addItem}
          language={language}
          currencyCode={currencyCode}
          isOpen={isAddItemOpen}
          setIsOpen={setIsAddItemOpen}
        />
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />

      <ExitConfirmModal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirm={() => {
          CapApp.exitApp();
        }}
        language={language}
      />

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteItem(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title={language === 'bn' ? 'আইটেম মুছুন' : 'Delete Item'}
        message={language === 'bn' ? 'আপনি কি সত্যিই এই আইটেমটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this item?'}
        confirmText={language === 'bn' ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}
        cancelText={language === 'bn' ? 'না' : 'No'}
      />
    </div>
  );
}
