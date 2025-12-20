import { defineStore } from 'pinia';
import { ref } from 'vue';

type ThemeOption = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeOption>('system');

  const applyTheme = () => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const isDark =
      theme.value === 'system' ? prefersDark : theme.value === 'dark';

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', theme.value);
  };

  const setTheme = (value: ThemeOption) => {
    theme.value = value;
    localStorage.setItem('theme', value);
    applyTheme();
  };

  const loadTheme = () => {
    const saved = localStorage.getItem('theme') as ThemeOption | null;
    theme.value = saved || 'system';
    applyTheme();
  };

  // ✅ Safe OS theme change listener
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemChange = (_: MediaQueryListEvent) => {
    if (theme.value === 'system') applyTheme();
  };
  mediaQuery.addEventListener('change', handleSystemChange);

  return { theme, setTheme, loadTheme };
});
