import { onMounted, ref } from 'vue';

const theme = ref<'light' | 'dark'>('light');

export function useTheme() {
  const setTheme = (value: 'light' | 'dark') => {
    theme.value = value;
    document.documentElement.classList.toggle('dark', value === 'dark');
    localStorage.setItem('theme', value);
  };

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  onMounted(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    setTheme(saved || (systemPrefersDark.matches ? 'dark' : 'light'));

    // Listen to OS theme change dynamically
    systemPrefersDark.addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  });

  return {
    theme,
    toggleTheme,
  };
}
