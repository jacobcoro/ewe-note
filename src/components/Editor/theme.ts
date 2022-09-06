import { ThemeColor } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';

const myTheme = nord.override((emotion, manager) => {
  manager.set(ThemeColor, ([key, opacity]) => {
    switch (key) {
      case 'primary':
        return `var(--primary)`;
      case 'secondary':
        return `var(--secondary)`;
      case 'neutral':
        return `var(--text)`;
      case 'solid':
        return `var(--text)`;
      case 'shadow':
        return `var(--shadow)`;
      case 'line':
        return `var(--grey-med)`;
      case 'surface':
        return `var(--paper)`;
      case 'background':
        return `var(--bg)`;
    }
  });
});

export default myTheme;
