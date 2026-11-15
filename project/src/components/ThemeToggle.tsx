import { Sun, Moon } from 'lucide-react';
import type { Theme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-dark-700 transition-colors duration-300 flex items-center px-0.5"
      aria-label="Toggle theme"
    >
      <div
        className={`w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${
          theme === 'dark'
            ? 'translate-x-7 bg-dark-900'
            : 'translate-x-0 bg-white shadow-md'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-warmyellow-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-warmyellow-500" />
        )}
      </div>
    </button>
  );
}
