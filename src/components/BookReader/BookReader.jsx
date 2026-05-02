import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateReadingProgress } from '../../store/slices/progressSlice';
import { addNote, addHighlight } from '../../store/slices/notesSlice';
import { t } from '../../utils/translations';
import styles from './BookReader.module.css';

const BookReader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.auth);
  const { books } = useSelector(state => state.books);
  const { readingProgress } = useSelector(state => state.progress);
  const { notes } = useSelector(state => state.notes);

  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');
  const [showNotes, setShowNotes] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const book = books.find(b => b.id === parseInt(bookId));
  const progress = readingProgress[bookId] || 0;
  const bookNotes = notes.filter(note => note.bookId === parseInt(bookId));

  // Симуляция содержимого книги
  const bookContent = [
    {
      page: 1,
      title: "Глава 1. Введение",
      content: `
        <h2>Введение в предмет</h2>
        <p>Добро пожаловать в увлекательный мир знаний! Эта книга откроет перед вами новые горизонты понимания и поможет развить критическое мышление.</p>
        <p>В процессе изучения материала вы познакомитесь с основными концепциями, научитесь применять полученные знания на практике и разовьете навыки самостоятельного анализа.</p>
        <p>Каждая глава содержит теоретический материал, практические примеры и задания для закрепления знаний. Рекомендуется внимательно изучать каждый раздел и выполнять все предложенные упражнения.</p>
        <h3>Структура книги</h3>
        <ul>
          <li>Теоретические основы</li>
          <li>Практические примеры</li>
          <li>Задания для самопроверки</li>
          <li>Дополнительные материалы</li>
        </ul>
      `
    },
    {
      page: 2,
      title: "Глава 2. Основные понятия",
      content: `
        <h2>Основные понятия и определения</h2>
        <p>В этой главе мы рассмотрим ключевые термины и понятия, которые будут использоваться на протяжении всего курса изучения.</p>
        <p><strong>Определение 1:</strong> Основное понятие - это фундаментальная идея или концепция, которая служит основой для понимания более сложных тем.</p>
        <p><strong>Определение 2:</strong> Практическое применение - использование теоретических знаний для решения реальных задач и проблем.</p>
        <h3>Важные принципы</h3>
        <p>При изучении материала следует руководствоваться следующими принципами:</p>
        <ol>
          <li>Последовательность изучения</li>
          <li>Практическое применение знаний</li>
          <li>Критический анализ информации</li>
          <li>Самостоятельная работа</li>
        </ol>
      `
    },
    {
      page: 3,
      title: "Глава 3. Практические примеры",
      content: `
        <h2>Практические примеры и задачи</h2>
        <p>Теория без практики остается лишь набором абстрактных понятий. В этой главе мы рассмотрим конкретные примеры применения изученного материала.</p>
        <h3>Пример 1: Базовая задача</h3>
        <p>Рассмотрим простую задачу, которая демонстрирует основные принципы:</p>
        <div class="example-box">
          <p><strong>Условие:</strong> Дана задача, требующая применения основных понятий.</p>
          <p><strong>Решение:</strong> Пошаговый разбор с объяснением каждого этапа.</p>
          <p><strong>Ответ:</strong> Окончательный результат с проверкой.</p>
        </div>
        <h3>Пример 2: Усложненная задача</h3>
        <p>Более сложный пример, требующий комплексного подхода и использования нескольких методов решения.</p>
      `
    }
  ];

  const totalPages = bookContent.length;

  useEffect(() => {
    if (book) {
      const newProgress = Math.round((currentPage / totalPages) * 100);
      if (newProgress !== progress) {
        dispatch(updateReadingProgress({ bookId: parseInt(bookId), progress: newProgress }));
      }
    }
  }, [currentPage, totalPages, bookId, progress, dispatch, book]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
      setShowNoteModal(true);
    }
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      dispatch(addNote({
        bookId: parseInt(bookId),
        content: noteText,
        page: currentPage,
        selectedText: selectedText
      }));
      setNoteText('');
      setSelectedText('');
      setShowNoteModal(false);
    }
  };

  const handleAddHighlight = () => {
    if (selectedText) {
      dispatch(addHighlight({
        bookId: parseInt(bookId),
        text: selectedText,
        page: currentPage
      }));
      setSelectedText('');
      setShowNoteModal(false);
    }
  };

  if (!book) {
    return (
      <div className={styles.notFound}>
        <h2>Книга не найдена</h2>
        <button onClick={() => navigate('/catalog')} className={styles.backButton}>
          Вернуться к каталогу
        </button>
      </div>
    );
  }

  const currentContent = bookContent[currentPage - 1];

  return (
    <div className={`${styles.reader} ${styles[theme]}`}>
      <div className={styles.readerHeader}>
        <button onClick={() => navigate('/catalog')} className={styles.backButton}>
          ← {t('back', language)}
        </button>
        <h1 className={styles.bookTitle}>{book.title}</h1>
        <div className={styles.readerControls}>
          <button 
            onClick={() => setShowNotes(!showNotes)}
            className={`${styles.controlButton} ${showNotes ? styles.active : ''}`}
          >
            📝 {t('notes', language)}
          </button>
          <select 
            value={fontSize} 
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className={styles.fontSizeSelect}
          >
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
            <option value={22}>22px</option>
          </select>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={styles.themeButton}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      <div className={styles.readerBody}>
        <div className={styles.readerContent}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
            <span className={styles.progressText}>
              {progress}% • {language === 'ru' ? 'Страница' : 'Адаҟьа'} {currentPage} {language === 'ru' ? 'из' : 'ала'} {totalPages}
            </span>
          </div>

          <div 
            className={styles.bookContent}
            style={{ fontSize: `${fontSize}px` }}
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{ __html: currentContent.content }}
          />

          <div className={styles.navigation}>
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={styles.navButton}
            >
              ← {language === 'ru' ? 'Предыдущая' : 'Иацҵаз'}
            </button>
            <span className={styles.pageInfo}>
              {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={styles.navButton}
            >
              {language === 'ru' ? 'Следующая' : 'Анаҩстәи'} →
            </button>
          </div>
        </div>

        {showNotes && (
          <div className={styles.notesSidebar}>
            <h3>{t('notes', language)}</h3>
            <div className={styles.notesList}>
              {bookNotes.map(note => (
                <div key={note.id} className={styles.noteItem}>
                  <div className={styles.noteHeader}>
                    <span className={styles.notePage}>
                      {language === 'ru' ? 'Стр.' : 'Адаҟьа'} {note.page}
                    </span>
                    <span className={styles.noteDate}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {note.selectedText && (
                    <div className={styles.selectedText}>
                      "{note.selectedText}"
                    </div>
                  )}
                  <div className={styles.noteContent}>
                    {note.content}
                  </div>
                </div>
              ))}
              {bookNotes.length === 0 && (
                <div className={styles.emptyNotes}>
                  {language === 'ru' ? 'Заметок пока нет' : 'Азгәаҭақәа мҿы ыҟам'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showNoteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{language === 'ru' ? 'Добавить заметку' : 'Азгәаҭа ацҵара'}</h3>
            {selectedText && (
              <div className={styles.selectedTextPreview}>
                <strong>{language === 'ru' ? 'Выделенный текст:' : 'Агәыҧшу атекст:'}</strong>
                <p>"{selectedText}"</p>
              </div>
            )}
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={language === 'ru' ? 'Введите заметку...' : 'Азгәаҭа ҭажәгал...'}
              className={styles.noteTextarea}
            />
            <div className={styles.modalActions}>
              <button onClick={handleAddHighlight} className={styles.highlightButton}>
                🖍️ {language === 'ru' ? 'Выделить' : 'Агәыҧшра'}
              </button>
              <button onClick={handleAddNote} className={styles.saveButton}>
                💾 {t('save', language)}
              </button>
              <button 
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText('');
                  setSelectedText('');
                }}
                className={styles.cancelButton}
              >
                {t('cancel', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReader;