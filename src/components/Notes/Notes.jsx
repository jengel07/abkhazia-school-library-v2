import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNote, updateNote, deleteNote } from '../../store/slices/notesSlice';
import { t } from '../../utils/translations';
import styles from './Notes.module.css';

const Notes = () => {
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.auth);
  const { books } = useSelector(state => state.books);
  const { notes, highlights } = useSelector(state => state.notes);
  
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedBook, setSelectedBook] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    bookId: '',
    content: '',
    page: 1
  });

  const getFilteredNotes = () => {
    let filtered = notes;
    
    if (selectedBook !== 'all') {
      filtered = filtered.filter(note => note.bookId === parseInt(selectedBook));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.selectedText && note.selectedText.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getFilteredHighlights = () => {
    let filtered = highlights;
    
    if (selectedBook !== 'all') {
      filtered = filtered.filter(highlight => highlight.bookId === parseInt(selectedBook));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(highlight => 
        highlight.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Неизвестная книга';
  };

  const handleAddNote = () => {
    if (newNote.content.trim() && newNote.bookId) {
      dispatch(addNote({
        ...newNote,
        bookId: parseInt(newNote.bookId)
      }));
      setNewNote({ bookId: '', content: '', page: 1 });
      setShowAddModal(false);
    }
  };

  const handleUpdateNote = () => {
    if (editingNote && editingNote.content.trim()) {
      dispatch(updateNote({
        id: editingNote.id,
        content: editingNote.content
      }));
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm(language === 'ru' ? 'Удалить заметку?' : 'Азгәаҭа аныхра?')) {
      dispatch(deleteNote(noteId));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotes = getFilteredNotes();
  const filteredHighlights = getFilteredHighlights();

  return (
    <div className={styles.notes}>
      <div className={styles.notesHeader}>
        <h1 className={styles.notesTitle}>
          {t('notes', language)}
        </h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className={styles.addButton}
        >
          ➕ {t('addNote', language)}
        </button>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              {language === 'ru' ? 'Книга:' : 'Алибра:'}
            </label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">{t('all', language)}</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              {t('search', language)}:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ru' ? 'Поиск в заметках...' : 'Азгәаҭақәара аҧшаара...'}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'notes' ? styles.active : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 {t('notes', language)} ({filteredNotes.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'highlights' ? styles.active : ''}`}
            onClick={() => setActiveTab('highlights')}
          >
            🖍️ {t('highlights', language)} ({filteredHighlights.length})
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'notes' && (
            <div className={styles.notesTab}>
              {filteredNotes.length > 0 ? (
                <div className={styles.notesList}>
                  {filteredNotes.map(note => (
                    <div key={note.id} className={styles.noteCard}>
                      <div className={styles.noteHeader}>
                        <div className={styles.noteInfo}>
                          <span className={styles.bookTitle}>
                            📚 {getBookTitle(note.bookId)}
                          </span>
                          {note.page && (
                            <span className={styles.pageNumber}>
                              {language === 'ru' ? 'Стр.' : 'Адаҟьа'} {note.page}
                            </span>
                          )}
                        </div>
                        <div className={styles.noteActions}>
                          <button 
                            onClick={() => setEditingNote(note)}
                            className={styles.editButton}
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteNote(note.id)}
                            className={styles.deleteButton}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {note.selectedText && (
                        <div className={styles.selectedText}>
                          <strong>{language === 'ru' ? 'Выделенный текст:' : 'Агәыҧшу атекст:'}</strong>
                          <p>"{note.selectedText}"</p>
                        </div>
                      )}

                      <div className={styles.noteContent}>
                        {note.content}
                      </div>

                      <div className={styles.noteFooter}>
                        <span className={styles.noteDate}>
                          {formatDate(note.createdAt)}
                        </span>
                        {note.updatedAt && note.updatedAt !== note.createdAt && (
                          <span className={styles.updatedDate}>
                            {language === 'ru' ? 'Изменено:' : 'Иҧсахуп:'} {formatDate(note.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📝</div>
                  <h3>{language === 'ru' ? 'Заметок пока нет' : 'Азгәаҭақәа мҿы ыҟам'}</h3>
                  <p>
                    {language === 'ru' 
                      ? 'Создайте первую заметку или выделите текст при чтении книги'
                      : 'Иацҵу азгәаҭа ҿыц мамзаргьы алибра аҧхьара атекст агәыҧшра'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className={styles.highlightsTab}>
              {filteredHighlights.length > 0 ? (
                <div className={styles.highlightsList}>
                  {filteredHighlights.map(highlight => (
                    <div key={highlight.id} className={styles.highlightCard}>
                      <div className={styles.highlightHeader}>
                        <div className={styles.highlightInfo}>
                          <span className={styles.bookTitle}>
                            📚 {getBookTitle(highlight.bookId)}
                          </span>
                          {highlight.page && (
                            <span className={styles.pageNumber}>
                              {language === 'ru' ? 'Стр.' : 'Адаҟьа'} {highlight.page}
                            </span>
                          )}
                        </div>
                        <span className={styles.highlightDate}>
                          {formatDate(highlight.createdAt)}
                        </span>
                      </div>

                      <div className={styles.highlightText}>
                        "{highlight.text}"
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🖍️</div>
                  <h3>{language === 'ru' ? 'Выделений пока нет' : 'Агәыҧшрақәа мҿы ыҟам'}</h3>
                  <p>
                    {language === 'ru' 
                      ? 'Выделяйте важные фрагменты текста при чтении книг'
                      : 'Алибрақәа аҧхьара атекст амҩа фрагментқәа гәыҧшатәуп'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно добавления заметки */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{t('addNote', language)}</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {language === 'ru' ? 'Книга:' : 'Алибра:'}
              </label>
              <select
                value={newNote.bookId}
                onChange={(e) => setNewNote({...newNote, bookId: e.target.value})}
                className={styles.formSelect}
                required
              >
                <option value="">{language === 'ru' ? 'Выберите книгу' : 'Алибра алхра'}</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {language === 'ru' ? 'Страница (необязательно):' : 'Адаҟьа (иаҭахым):'}
              </label>
              <input
                type="number"
                value={newNote.page}
                onChange={(e) => setNewNote({...newNote, page: parseInt(e.target.value) || 1})}
                className={styles.formInput}
                min="1"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {t('noteContent', language)}:
              </label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className={styles.formTextarea}
                placeholder={language === 'ru' ? 'Введите текст заметки...' : 'Азгәаҭа атекст ҭажәгал...'}
                required
              />
            </div>

            <div className={styles.modalActions}>
              <button 
                onClick={handleAddNote}
                className={styles.saveButton}
                disabled={!newNote.content.trim() || !newNote.bookId}
              >
                💾 {t('save', language)}
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className={styles.cancelButton}
              >
                {t('cancel', language)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования заметки */}
      {editingNote && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{t('edit', language)} {language === 'ru' ? 'заметку' : 'азгәаҭа'}</h2>
              <button 
                onClick={() => setEditingNote(null)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {t('noteContent', language)}:
              </label>
              <textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                className={styles.formTextarea}
                required
              />
            </div>

            <div className={styles.modalActions}>
              <button 
                onClick={handleUpdateNote}
                className={styles.saveButton}
                disabled={!editingNote.content.trim()}
              >
                💾 {t('save', language)}
              </button>
              <button 
                onClick={() => setEditingNote(null)}
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

export default Notes;