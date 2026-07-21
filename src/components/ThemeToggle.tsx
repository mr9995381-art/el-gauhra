import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function ThemeToggle({ darkMode, setDarkMode }: ThemeToggleProps) {
  const toggle = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    document.documentElement.classList.toggle('dark', newVal);
    localStorage.setItem('theme', newVal ? 'dark' : 'light');
  };

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggle}
      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:opacity-90"
      aria-label="Toggle theme"
    >
      {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
    </button>
  );
}
