import { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Brain,
  BookMarked,
  MessageCircle,
  Flame,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import type { View, UserProgress } from '@/types';
import { getLevelFromXp, getLevelProgress } from '@/data/levels';
import { ThemeToggle } from './ThemeToggle';
import { ProgressBar } from './ProgressBar';
import type { Theme } from '@/hooks/useTheme';
import { formatStreak } from '@/language';
import { useLanguage } from '@/languageContext';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  theme: Theme;
  toggleTheme: () => void;
  progress: UserProgress;
  onOpenChat: () => void;
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Quiz', icon: Brain },
  { id: 'dictionary', label: 'Dictionary', icon: BookMarked },
];

const iconMap: Record<string, typeof LayoutDashboard> = {
  Sprout: LayoutDashboard,
  Compass: LayoutDashboard,
  MessageSquare: MessageCircle,
  GraduationCap: LayoutDashboard,
  Crown: LayoutDashboard,
};

export function Navbar({ currentView, setView, theme, toggleTheme, progress, onOpenChat }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const level = getLevelFromXp(progress.xp);
  const levelProgress = getLevelProgress(progress.xp);
  const LevelIcon = iconMap[level.icon] || Sparkles;

  const handleNavClick = (view: View) => {
    setView(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 flex-col z-30">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-none">
                HablaFlow
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('Learn Spanish')}</p>
            </div>
          </div>

          {/* Level badge */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-coral-50 dark:from-dark-800 dark:to-dark-700 border border-primary-100 dark:border-dark-600">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center">
                <LevelIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Level')} {level.level}</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                  {language === 'uk' ? level.nameUa : level.name}
                </p>
              </div>
            </div>
            <ProgressBar value={levelProgress} color="gradient-bg" height="h-2" />
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-gray-400">{progress.xp} XP</span>
              <span className="text-xs text-gray-400">{Math.round(levelProgress)}%</span>
            </div>
          </div>

          {/* Streak */}
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-coral-50 dark:bg-dark-800 border border-coral-100 dark:border-dark-700">
            <Flame className="w-5 h-5 text-coral-500" />
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {formatStreak(progress.streak, language)}
            </span>
          </div>

          {/* Nav items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    active
                      ? 'gradient-bg text-white shadow-lg shadow-primary-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {t(item.label)}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={onOpenChat}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm bg-dark-900 dark:bg-white text-white dark:text-dark-900 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-5 h-5" />
              {t('AI Tutor Chat')}
            </button>
            <div className="mt-4 flex items-center justify-between px-2">
              <span className="text-xs text-gray-400">{t('Theme')}</span>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            <label className="mt-3 flex items-center justify-between px-2 text-xs text-gray-400">
              <span>{t('Language')}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value === 'uk' ? 'uk' : 'en')}
                className="rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-2 py-1 text-sm text-gray-700 dark:text-gray-200"
              >
                <option value="en">English</option>
                <option value="uk">Українська</option>
              </select>
            </label>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">H</span>
            </div>
            <h1 className="font-display font-bold text-base text-gray-900 dark:text-white">HablaFlow</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-coral-50 dark:bg-dark-800">
              <Flame className="w-4 h-4 text-coral-500" />
              <span className="font-semibold text-xs text-gray-900 dark:text-white">{progress.streak}</span>
            </div>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-dark-800 flex items-center justify-center text-gray-700 dark:text-gray-300"
              aria-label={t('Menu')}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 z-20 animate-slide-up">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    active
                      ? 'gradient-bg text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {t(item.label)}
                </button>
              );
            })}
            <button
              onClick={() => { onOpenChat(); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm bg-dark-900 text-white"
            >
              <MessageCircle className="w-5 h-5" />
              {t('AI Tutor Chat')}
            </button>
            <label className="mt-3 flex items-center justify-between px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
              <span>{t('Language')}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value === 'uk' ? 'uk' : 'en')}
                className="rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-2 py-1 text-sm text-gray-700 dark:text-gray-200"
              >
                <option value="en">English</option>
                <option value="uk">Українська</option>
              </select>
            </label>
          </nav>
        </div>
      )}
    </>
  );
}
