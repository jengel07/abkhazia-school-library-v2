import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { t } from '../../utils/translations';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, userType, language } = useSelector(state => state.auth);
  const { books } = useSelector(state => state.books);
  const { assignments } = useSelector(state => state.assignments);
  const { readingProgress, totalPoints, achievements } = useSelector(state => state.progress);

  const getUserTypeLabel = () => {
    return t(userType, language);
  };

  const getRecentBooks = () => {
    return books.slice(0, 3).map(book => ({
      ...book,
      progress: readingProgress[book.id] || 0
    }));
  };

  const getRecentAssignments = () => {
    if (userType === 'student') {
      return assignments.slice(0, 3);
    }
    return [];
  };

  const getRecentAchievements = () => {
    return achievements.slice(0, 3);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getStats = () => {
    if (userType === 'student') {
      return [
        {
          icon: '📚',
          value: books.length,
          label: t('books', language),
          type: 'books'
        },
        {
          icon: '📊',
          value: `${Object.keys(readingProgress).length}`,
          label: language === 'ru' ? 'Прочитано' : 'Иаҧхьаз',
          type: 'progress'
        },
        {
          icon: '📝',
          value: assignments.length,
          label: t('assignments', language),
          type: 'assignments'
        },
        {
          icon: '⭐',
          value: totalPoints,
          label: t('totalPoints', language),
          type: 'points'
        }
      ];
    } else if (userType === 'teacher') {
      return [
        {
          icon: '👥',
          value: '24',
          label: language === 'ru' ? 'Учеников' : 'Аҟәҵаҩцәа',
          type: 'books'
        },
        {
          icon: '📝',
          value: assignments.length,
          label: t('assignments', language),
          type: 'assignments'
        },
        {
          icon: '📊',
          value: '18',
          label: language === 'ru' ? 'Выполнено' : 'Иҟоуп',
          type: 'progress'
        },
        {
          icon: '📚',
          value: books.length,
          label: t('books', language),
          type: 'points'
        }
      ];
    } else {
      return [
        {
          icon: '👶',
          value: '2',
          label: language === 'ru' ? 'Детей' : 'Асабиқәа',
          type: 'books'
        },
        {
          icon: '📚',
          value: '12',
          label: language === 'ru' ? 'Прочитано' : 'Иаҧхьаз',
          type: 'progress'
        },
        {
          icon: '📝',
          value: '8',
          label: language === 'ru' ? 'Заданий' : 'Азадачақәа',
          type: 'assignments'
        },
        {
          icon: '⭐',
          value: '340',
          label: language === 'ru' ? 'Баллов' : 'Абалқәа',
          type: 'points'
        }
      ];
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.welcomeMessage}>
          {language === 'ru' ? 'Добро пожаловать' : 'Бзиала шәаабеит'}, {user?.name || user?.username}!
        </h1>
        <p className={styles.userRole}>
          {getUserTypeLabel()}
        </p>
      </div>

      <div className={styles.statsGrid}>
        {getStats().map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles[stat.type]}`}>
              {stat.icon}
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          {userType === 'student' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {language === 'ru' ? 'Недавние книги' : 'Аҿыцтәи алибрақәа'}
                </h2>
                <Link to="/catalog" className={styles.sectionAction}>
                  {language === 'ru' ? 'Все книги' : 'Алибрақәа зегьы'}
                </Link>
              </div>
              <div className={styles.recentBooks}>
                {getRecentBooks().map(book => (
                  <div key={book.id} className={styles.bookItem}>
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className={styles.bookCover}
                    />
                    <div className={styles.bookInfo}>
                      <div className={styles.bookTitle}>{book.title}</div>
                      <div className={styles.bookAuthor}>{book.author}</div>
                      <div className={styles.bookProgress}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>{book.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(userType === 'student' || userType === 'teacher') && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {userType === 'student' 
                    ? (language === 'ru' ? 'Текущие задания' : 'Иҟоу азадачақәа')
                    : (language === 'ru' ? 'Недавние задания' : 'Аҿыцтәи азадачақәа')
                  }
                </h2>
                <Link to="/assignments" className={styles.sectionAction}>
                  {language === 'ru' ? 'Все задания' : 'Азадачақәа зегьы'}
                </Link>
              </div>
              <div className={styles.assignmentsList}>
                {getRecentAssignments().length > 0 ? (
                  getRecentAssignments().map(assignment => (
                    <div key={assignment.id} className={styles.assignmentItem}>
                      <div className={styles.assignmentTitle}>{assignment.title}</div>
                      <div className={styles.assignmentMeta}>
                        <span>
                          {language === 'ru' ? 'Вопросов' : 'Азҵаарақәа'}: {assignment.questions.length}
                        </span>
                        <span className={`${styles.dueDate} ${isOverdue(assignment.dueDate) ? styles.overdue : ''}`}>
                          {formatDate(assignment.dueDate)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📝</div>
                    <div className={styles.emptyText}>
                      {language === 'ru' ? 'Нет активных заданий' : 'Иҟоу азадачақәа ыҟам'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          {userType === 'student' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {t('achievements', language)}
                </h2>
              </div>
              <div className={styles.achievementsList}>
                {getRecentAchievements().length > 0 ? (
                  getRecentAchievements().map((achievement, index) => (
                    <div key={index} className={styles.achievementItem}>
                      <div className={styles.achievementIcon}>🏆</div>
                      <div className={styles.achievementInfo}>
                        <div className={styles.achievementTitle}>{achievement.title}</div>
                        <div className={styles.achievementDate}>
                          {formatDate(achievement.earnedAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🏆</div>
                    <div className={styles.emptyText}>
                      {language === 'ru' ? 'Пока нет достижений' : 'Мҿы адостижениақәа ыҟам'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                {language === 'ru' ? 'Быстрые действия' : 'Арыдкәа ҟазшьақәа'}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/catalog" className={styles.sectionAction}>
                📚 {language === 'ru' ? 'Найти книгу' : 'Алибра аҧшаара'}
              </Link>
              {userType === 'student' && (
                <>
                  <Link to="/notes" className={styles.sectionAction}>
                    📋 {t('notes', language)}
                  </Link>
                  <Link to="/progress" className={styles.sectionAction}>
                    📊 {t('progress', language)}
                  </Link>
                </>
              )}
              {userType === 'teacher' && (
                <Link to="/assignments" className={styles.sectionAction}>
                  ➕ {t('createAssignment', language)}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;