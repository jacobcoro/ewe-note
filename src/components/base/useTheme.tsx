import { useEffect, useState } from 'react';

export type Themes = 'light' | 'dark';

const code = {
  // light: 'https://unpkg.com/prism-themes/themes/prism-material-light.css',
  light: 'https://unpkg.com/prism-themes/themes/prism-vs.css',
  dark: 'https://unpkg.com/prism-themes/themes/prism-vsc-dark-plus.css',
};

const setSyntaxHighlightStyleLink = (theme: Themes) => {
  const target = document.querySelector('#prism-theme');

  if (target) {
    return target;
  }

  const link = document.createElement('link');
  link.id = 'prism-theme';
  link.setAttribute('rel', 'stylesheet');
  document.head.appendChild(link);

  link.setAttribute('href', theme === 'dark' ? code.dark : code.light);
};

const useTheme = () => {
  // This code assumes a Light Mode default (set data-theme="light" on index.html)
  const [theme, setTheme] = useState<Themes>('light');

  // find initial theme
  useEffect(() => {
    if (
      /* This condition checks whether the user has set a site preference for dark mode OR a OS-level preference for Dark Mode AND no site preference */
      localStorage.getItem('color-mode') === 'dark' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches &&
        !localStorage.getItem('color-mode'))
    ) {
      // if true, set the site to Dark Mode
      applyTheme('dark');
    } else applyTheme('light');
  }, []);

  const applyTheme = (newTheme: Themes) => {
    localStorage.setItem('color-mode', newTheme);
    setTheme(newTheme);
    if (document.documentElement.getAttribute('data-color-mode') === newTheme)
      return;
    document.documentElement.setAttribute('data-color-mode', newTheme); //the editor prefers this attribute
    setSyntaxHighlightStyleLink(newTheme);
  };

  const toggleTheme = () => {
    applyTheme(
      document.documentElement.getAttribute('data-color-mode') === 'light'
        ? 'dark'
        : 'light'
    );
  };

  return {
    theme,
    setTheme: applyTheme,
    toggleTheme,
  };
};
export default useTheme;
