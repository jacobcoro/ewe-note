import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotesApp from './pages/NotesApp';
import NotFound from './pages/NotFound';
import ThemeProvider from 'components/base/ThemeContext';
import { StoreProvider } from 'model/storeContext';
import NavBar from 'components/base/NavBar';

export function App() {
  return (
    <div id="app-root" data-theme="light" className="root">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes-app" element={<NotesApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export function WrappedApp() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}
