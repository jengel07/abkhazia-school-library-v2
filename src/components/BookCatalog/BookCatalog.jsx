import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setSearchQuery, 
  setSubjectFilter, 
  setGradeFilter, 
  setTypeFilter, 
  clearFilters 
} from '../../store/slices/booksSlice';
import { t } from '../../utils/translations';
import styles from './BookCatalog.module.css';

const BookCatalog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language } = useSelector(state => state.auth);
  const { 
    filteredBooks, 
    searchQuery, 
    selectedSubject, 
    selectedGrade, 
    selectedType 
  } = useSelector(state => state.books);

  const subjects = [
    { value: 'all', label: t('all', language) },
    { value: 'mathematics', label: t('mathematics', language) },
    { value: 'physics', label: t('physics', language) },
    { value: 'chemistry', label: t('chemistry', language) },
    { value: 'biology', label: t('biology', language) },
    { value: 'history', label: t('history', language) },
    { value: 'literature', label: t('literature', language) },
    { value: 'geography', label: t('geography', language) }
  ];

  const grades = [
    { value: 'all', label: t('all', language) },
    ...Array.from({ length: 11 }, (_, i) => ({ 
      value: (i + 1).toString(), 
      label: `${i + 1} ${language === 'ru' ? 'класс' : 'клас'}` 
    }))
  ];

  const types = [
    { value: 'all', label: t('all', language) },
    { value: 'textbook', label: t('textbook', language) },
    { value: 'fiction', label: t('fiction', language) },
    { value: 'reference', label: t('reference', language) }
  ];

  const handleDownload = (book) => {
    // Имитация скачивания
    const link = document.createElement('a');
    link.href = book.downloadUrl;
    link.download = `${book.title}.${book.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Показываем уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
      z-index: 1000;
      font-weight: 600;
    `;
    notification.textContent = `${language === 'ru' ? 'Скачивание началось:' : 'Аҭагалара алагоуп:'} ${book.title}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleRead = (book) => {
    navigate(`/book/${book.id}`);
  };

  const getSubjectLabel = (subject) => {
    return t(subject, language);
  };

  return (
    <div className={styles.catalog}>
      <div className={styles.catalogHeader}>
        <h1 className={styles.catalogTitle}>
          {t('catalog', language)}
        </h1>
        <p className={styles.catalogSubtitle}>
          {language === 'ru' 
            ? 'Цифровая библиотека учебных материалов для школ Абхазии'
            : 'Аабхазиа ашколақәа рзы аучебны аматериалқәа рцифрақәа библиотека'
          }
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              {t('search', language)}
            </label>
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск по названию или автору...' : 'Ахьӡ мамзаргьы автор ала аҧшаара...'}
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              {t('subjects', language)}
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => dispatch(setSubjectFilter(e.target.value))}
              className={styles.filterSelect}
            >
              {subjects.map(subject => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              {t('grades', language)}
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => dispatch(setGradeFilter(e.target.value))}
              className={styles.filterSelect}
            >
              {grades.map(grade => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              {t('bookTypes', language)}
            </label>
            <select
              value={selectedType}
              onChange={(e) => dispatch(setTypeFilter(e.target.value))}
              className={styles.filterSelect}
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => dispatch(clearFilters())}
            className={styles.clearButton}
          >
            {language === 'ru' ? 'Очистить' : 'Агәыҧшра'}
          </button>
        </div>
      </div>

      {filteredBooks.length > 0 && (
        <div className={styles.resultsCount}>
          {language === 'ru' 
            ? `Найдено книг: ${filteredBooks.length}`
            : `Ирыԥшааит алибрақәа: ${filteredBooks.length}`
          }
        </div>
      )}

      {filteredBooks.length > 0 ? (
        <div className={styles.booksGrid}>
          {filteredBooks.map(book => (
            <div key={book.id} className={styles.bookCard}>
              <img 
                src={book.coverImage} 
                alt={book.title}
                className={styles.bookCover}
              />
              <div className={styles.bookContent}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>{book.author}</p>
                
                <div className={styles.bookMeta}>
                  <span className={`${styles.bookTag} ${styles.subject}`}>
                    {getSubjectLabel(book.subject)}
                  </span>
                  <span className={`${styles.bookTag} ${styles.grade}`}>
                    {book.grade} {language === 'ru' ? 'класс' : 'клас'}
                  </span>
                  <span className={styles.bookTag}>
                    {t(book.type, language)}
                  </span>
                  <span className={styles.bookTag}>
                    {book.format}
                  </span>
                </div>

                <p className={styles.bookDescription}>
                  {book.description}
                </p>

                <div className={styles.bookActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.downloadButton}`}
                    onClick={() => handleDownload(book)}
                  >
                    📥 {t('download', language)}
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.readButton}`}
                    onClick={() => handleRead(book)}
                  >
                    📖 {t('read', language)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>📚</div>
          <h3 className={styles.noResultsTitle}>
            {language === 'ru' ? 'Книги не найдены' : 'Алибрақәа ҳамырԥшаам'}
          </h3>
          <p className={styles.noResultsText}>
            {language === 'ru' 
              ? 'Попробуйте изменить параметры поиска или очистить фильтры'
              : 'Аҧшаара апараметрқәа ҧсахтәуп мамзаргьы агәыҧшрақәа агәыҧшра шәҟәыҭтәуп'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookCatalog;