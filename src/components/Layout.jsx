import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kp-theme') || 'dark';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kp-theme', theme);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header__inner">
          <NavLink to="/" className="header__logo">
            <span className="header__logo-icon">
              <svg viewBox="0 0 24 28" width="22" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L2 4v10c0 7.73 4.28 11.94 10 14 5.72-2.06 10-6.27 10-14V4L12 0z" fill="var(--accent)"/>
                <path d="M12 1.5L3.5 5v9c0 6.9 3.84 10.7 8.5 12.4V14h-7V5.8L12 1.5z" fill="#fff"/>
                <path d="M12 1.5l8.5 3.5v9c0 6.9-3.84 10.7-8.5 12.4V14h7V5.8L12 1.5z" fill="#dc2626"/>
              </svg>
            </span>
            <span className="header__logo-text">Karta Polaka</span>
          </NavLink>

          <nav className={`header__nav ${mobileMenuOpen ? 'header__nav--open' : ''}`}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
            >
              <svg className="header__link-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Główna
            </NavLink>
            <NavLink
              to="/topics"
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
            >
              <svg className="header__link-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Baza wiedzy
            </NavLink>
            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
            >
              <svg className="header__link-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Quiz
            </NavLink>
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
            >
              <svg className="header__link-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Konto
            </NavLink>
          </nav>

          <div className="header__actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? 'mobile-menu-btn--open' : ''}`}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="main__inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
