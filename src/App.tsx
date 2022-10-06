import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Notes from './pages/Notes';
import NotFound from './pages/NotFound';
import ThemeProvider from 'components/base/ThemeContext';
import { DatabaseProvider } from '@eweser/hooks';
import NavBar from 'components/base/NavBar';

export function App() {
  return (
    <div id="app-root" data-theme="light" className="root">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes-app" element={<Notes />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export function WrappedApp() {
  return (
    <DatabaseProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </DatabaseProvider>
  );
}
