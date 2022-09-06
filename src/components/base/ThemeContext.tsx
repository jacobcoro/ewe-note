import { createContext, FC } from 'react';
import useTheme from './useTheme';

const initialContext = {
  theme: 'light',
  toggleTheme: () => {},
};

export const ThemeContext = createContext(initialContext);

const ThemeProvider: FC<{ children: any }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
