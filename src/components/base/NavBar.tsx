import styles from './NavBar.module.scss';
import { Link } from 'react-router-dom';
import { Moon, Sun } from '@styled-icons/fa-solid';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
const NavBar = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);
  return (
    <div className={styles.root}>
      <nav>
        <button onClick={() => toggleTheme()} className={styles.iconButton}>
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
        <ul className="links" role="navigation">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/notes-app">Notes</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
