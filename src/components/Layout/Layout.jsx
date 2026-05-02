import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setLanguage } from '../../store/slices/authSlice';
import { t } from '../../utils/translations';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated, userType, language } = useSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getNavLinks = () => {
    const links = [
      { path: '/catalog', label: t('catalog', language), icon: '📚' }
    ];

    if (isAuthenticated) {
      links.push({ path: '/dashboard', label: t('dashboard', language), icon: '👤' });
      
      if (userType === 'student' || userType === 'teacher') {
        links.push({ path: '/assignments', label: t('assignments', language), icon: '📝' });
      }
      
      if (userType === 'student') {
        links.push(
          { path: '/progress', label: t('progress', language), icon: '📊' },
          { path: '/notes', label: t('notes', language), icon: '📋' }
        );
      }
    }

    return links;
  };

  const navLinks = getNavLinks();

  if (!isAuthenticated && location.pathname !== '/') {
    return children;
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>📖</div>
            <span>Библиотека Абхазии</span>
          </Link>

          <nav className={styles.nav}>
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
              >
                <span style={{ marginRight: '0.5rem' }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.userInfo}>
            <div className={styles.languageSwitch}>
              <button
                className={`${styles.langButton} ${language === 'ru' ? styles.active : ''}`}
                onClick={() => handleLanguageChange('ru')}
              >
                РУС
              </button>
              <button
                className={`${styles.langButton} ${language === 'ab' ? styles.active : ''}`}
                onClick={() => handleLanguageChange('ab')}
              >
                АБХ
              </button>
            </div>

            {isAuthenticated && (
              <>
                <div className={styles.userAvatar}>
                  {user?.username?.charAt(0).toUpperCase() || 'У'}
                </div>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  {t('logout', language)}
                </button>
              </>
            )}

            <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
              ☰
            </button>
          </div>
        </div>

        <div className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.mobileNavLink} ${location.pathname === link.path ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span style={{ marginRight: '0.5rem' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button className={styles.mobileNavLink} onClick={handleLogout}>
              🚪 {t('logout', language)}
            </button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;