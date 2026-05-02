import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, setLanguage } from '../../store/slices/authSlice';
import { t } from '../../utils/translations';
import styles from './Login.module.css';

const Login = () => {
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'student'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Простая проверка демо-данных
    const demoUsers = {
      'student1': { userType: 'student', name: 'Анна Иванова' },
      'teacher1': { userType: 'teacher', name: 'Мария Петрова' },
      'parent1': { userType: 'parent', name: 'Сергей Сидоров' }
    };

    if (demoUsers[formData.username] && formData.password === 'demo') {
      dispatch(login({
        user: {
          id: 1,
          username: formData.username,
          name: demoUsers[formData.username].name
        },
        userType: demoUsers[formData.username].userType
      }));
    } else {
      alert('Неверные данные для входа. Используйте демо-аккаунты.');
    }
  };

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  const fillDemoCredentials = (username, userType) => {
    setFormData({
      username,
      password: 'demo',
      userType
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.languageToggle}>
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

      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginIcon}>📚</div>
          <h1 className={styles.loginTitle}>
            {language === 'ru' ? 'Электронная библиотека' : 'Аэлектронны библиотека'}
          </h1>
          <p className={styles.loginSubtitle}>
            {language === 'ru' ? 'Школы Абхазии' : 'Аабхазиа ашколақәа'}
          </p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t('username', language)}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t('password', language)}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t('userType', language)}
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className={styles.formSelect}
            >
              <option value="student">{t('student', language)}</option>
              <option value="teacher">{t('teacher', language)}</option>
              <option value="parent">{t('parent', language)}</option>
            </select>
          </div>

          <button type="submit" className={styles.loginButton}>
            {t('login', language)}
          </button>
        </form>

        <div className={styles.demoCredentials}>
          <div className={styles.demoTitle}>
            {language === 'ru' ? 'Демо-аккаунты:' : 'Адемо-аккаунтқәа:'}
          </div>
          <div className={styles.demoList}>
            <div 
              className={styles.demoItem}
              onClick={() => fillDemoCredentials('student1', 'student')}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.demoRole}>{t('student', language)}</span>
              <span className={styles.demoCredential}>student1 / demo</span>
            </div>
            <div 
              className={styles.demoItem}
              onClick={() => fillDemoCredentials('teacher1', 'teacher')}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.demoRole}>{t('teacher', language)}</span>
              <span className={styles.demoCredential}>teacher1 / demo</span>
            </div>
            <div 
              className={styles.demoItem}
              onClick={() => fillDemoCredentials('parent1', 'parent')}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.demoRole}>{t('parent', language)}</span>
              <span className={styles.demoCredential}>parent1 / demo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;