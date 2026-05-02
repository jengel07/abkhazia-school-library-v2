import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { t } from '../../utils/translations';
import styles from './Progress.module.css';

const Progress = () => {
  const { language } = useSelector(state => state.auth);
  const { books } = useSelector(state => state.books);
  const { readingProgress, totalPoints, achievements, scores } = useSelector(state => state.progress);
  const { completedAssignments } = useSelector(state => state.assignments);
  const [activeTab, setActiveTab] = useState('overview');

  const getReadingStats = () => {
    const totalBooks = books.length;
    const booksStarted = Object.keys(readingProgress).length;
    const booksCompleted = Object.values(readingProgress).filter(progress => progress === 100).length;
    const averageProgress = booksStarted > 0 
      ? Math.round(Object.values(readingProgress).reduce((sum, progress) => sum + progress, 0) / booksStarted)
      : 0;

    return { totalBooks, booksStarted, booksCompleted, averageProgress };
  };

  const getAssignmentStats = () => {
    const totalAssignments = completedAssignments.length;
    const averageScore = totalAssignments > 0
      ? Math.round(completedAssignments.reduce((sum, assignment) => sum + assignment.score, 0) / totalAssignments)
      : 0;
    const excellentScores = completedAssignments.filter(assignment => assignment.score >= 90).length;
    const goodScores = completedAssignments.filter(assignment => assignment.score >= 70 && assignment.score < 90).length;

    return { totalAssignments, averageScore, excellentScores, goodScores };
  };

  const getSubjectProgress = () => {
    const subjectStats = {};
    
    books.forEach(book => {
      const progress = readingProgress[book.id] || 0;
      if (!subjectStats[book.subject]) {
        subjectStats[book.subject] = {
          totalBooks: 0,
          totalProgress: 0,
          completedBooks: 0
        };
      }
      subjectStats[book.subject].totalBooks++;
      subjectStats[book.subject].totalProgress += progress;
      if (progress === 100) {
        subjectStats[book.subject].completedBooks++;
      }
    });

    return Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      averageProgress: Math.round(stats.totalProgress / stats.totalBooks),
      completedBooks: stats.completedBooks,
      totalBooks: stats.totalBooks
    }));
  };

  const getRecentActivity = () => {
    const activities = [];
    
    // Добавляем активность чтения
    Object.entries(readingProgress).forEach(([bookId, progress]) => {
      const book = books.find(b => b.id === parseInt(bookId));
      if (book && progress > 0) {
        activities.push({
          type: 'reading',
          book: book.title,
          progress,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
    });

    // Добавляем выполненные задания
    completedAssignments.forEach(assignment => {
      activities.push({
        type: 'assignment',
        title: `Задание выполнено`,
        score: assignment.score,
        date: new Date(assignment.completedAt)
      });
    });

    return activities.sort((a, b) => b.date - a.date).slice(0, 10);
  };

  const readingStats = getReadingStats();
  const assignmentStats = getAssignmentStats();
  const subjectProgress = getSubjectProgress();
  const recentActivity = getRecentActivity();

  const formatDate = (date) => {
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const getSubjectLabel = (subject) => {
    return t(subject, language);
  };

  const getLevelInfo = () => {
    const level = Math.floor(totalPoints / 100) + 1;
    const pointsToNextLevel = (level * 100) - totalPoints;
    const progressToNextLevel = ((totalPoints % 100) / 100) * 100;
    
    return { level, pointsToNextLevel, progressToNextLevel };
  };

  const levelInfo = getLevelInfo();

  return (
    <div className={styles.progress}>
      <div className={styles.progressHeader}>
        <h1 className={styles.progressTitle}>
          {t('progress', language)}
        </h1>
        <div className={styles.levelBadge}>
          <span className={styles.levelIcon}>🏆</span>
          <span className={styles.levelText}>
            {language === 'ru' ? 'Уровень' : 'Адәреҷа'} {levelInfo.level}
          </span>
        </div>
      </div>

      <div className={styles.overviewCards}>
        <div className={styles.overviewCard}>
          <div className={styles.cardIcon}>⭐</div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>{totalPoints}</div>
            <div className={styles.cardLabel}>{t('totalPoints', language)}</div>
            <div className={styles.cardProgress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${levelInfo.progressToNextLevel}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {levelInfo.pointsToNextLevel} {language === 'ru' ? 'до следующего уровня' : 'анаҩстәи адәреҷазы'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.cardIcon}>📚</div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>{readingStats.booksCompleted}</div>
            <div className={styles.cardLabel}>
              {language === 'ru' ? 'Книг прочитано' : 'Алибрақәа иаҧхьаз'}
            </div>
            <div className={styles.cardSubtext}>
              {language === 'ru' ? 'из' : 'ала'} {readingStats.totalBooks} {language === 'ru' ? 'доступных' : 'иаҟоу'}
            </div>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.cardIcon}>📝</div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>{assignmentStats.totalAssignments}</div>
            <div className={styles.cardLabel}>
              {language === 'ru' ? 'Заданий выполнено' : 'Азадачақәа иҟоуп'}
            </div>
            <div className={styles.cardSubtext}>
              {language === 'ru' ? 'Средний балл:' : 'Асреднеи абал:'} {assignmentStats.averageScore}%
            </div>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.cardIcon}>🎯</div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>{readingStats.averageProgress}%</div>
            <div className={styles.cardLabel}>
              {language === 'ru' ? 'Средний прогресс' : 'Асреднеи апрогресс'}
            </div>
            <div className={styles.cardSubtext}>
              {readingStats.booksStarted} {language === 'ru' ? 'книг в процессе' : 'алибра апроцессра'}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 {language === 'ru' ? 'Обзор' : 'Аобзор'}
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'subjects' ? styles.active : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            📚 {language === 'ru' ? 'По предметам' : 'Апредметқәала'}
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            🏆 {t('achievements', language)}
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'activity' ? styles.active : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            📈 {language === 'ru' ? 'Активность' : 'Аактивность'}
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                  <h3>{language === 'ru' ? 'Прогресс чтения' : 'Аҧхьара прогресс'}</h3>
                  <div className={styles.readingChart}>
                    {books.slice(0, 5).map(book => {
                      const progress = readingProgress[book.id] || 0;
                      return (
                        <div key={book.id} className={styles.bookProgressItem}>
                          <div className={styles.bookInfo}>
                            <span className={styles.bookTitle}>{book.title}</span>
                            <span className={styles.progressPercent}>{progress}%</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.chartCard}>
                  <h3>{language === 'ru' ? 'Результаты заданий' : 'Азадачақәа рарезультатқәа'}</h3>
                  <div className={styles.assignmentChart}>
                    <div className={styles.scoreDistribution}>
                      <div className={styles.scoreItem}>
                        <div className={styles.scoreBar}>
                          <div 
                            className={`${styles.scoreFill} ${styles.excellent}`}
                            style={{ width: `${(assignmentStats.excellentScores / Math.max(assignmentStats.totalAssignments, 1)) * 100}%` }}
                          />
                        </div>
                        <span className={styles.scoreLabel}>
                          {language === 'ru' ? 'Отлично (90-100%)' : 'Иашоуп (90-100%)'}
                        </span>
                        <span className={styles.scoreCount}>{assignmentStats.excellentScores}</span>
                      </div>
                      <div className={styles.scoreItem}>
                        <div className={styles.scoreBar}>
                          <div 
                            className={`${styles.scoreFill} ${styles.good}`}
                            style={{ width: `${(assignmentStats.goodScores / Math.max(assignmentStats.totalAssignments, 1)) * 100}%` }}
                          />
                        </div>
                        <span className={styles.scoreLabel}>
                          {language === 'ru' ? 'Хорошо (70-89%)' : 'Иашоуп (70-89%)'}
                        </span>
                        <span className={styles.scoreCount}>{assignmentStats.goodScores}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className={styles.subjectsTab}>
              <div className={styles.subjectsGrid}>
                {subjectProgress.map(subject => (
                  <div key={subject.subject} className={styles.subjectCard}>
                    <div className={styles.subjectHeader}>
                      <h3>{getSubjectLabel(subject.subject)}</h3>
                      <span className={styles.subjectProgress}>{subject.averageProgress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${subject.averageProgress}%` }}
                      />
                    </div>
                    <div className={styles.subjectStats}>
                      <span>
                        {subject.completedBooks} {language === 'ru' ? 'из' : 'ала'} {subject.totalBooks} {language === 'ru' ? 'книг' : 'алибра'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className={styles.achievementsTab}>
              {achievements.length > 0 ? (
                <div className={styles.achievementsList}>
                  {achievements.map((achievement, index) => (
                    <div key={index} className={styles.achievementItem}>
                      <div className={styles.achievementIcon}>🏆</div>
                      <div className={styles.achievementContent}>
                        <h4>{achievement.title}</h4>
                        <p>{achievement.description}</p>
                        <span className={styles.achievementDate}>
                          {formatDate(new Date(achievement.earnedAt))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🏆</div>
                  <h3>{language === 'ru' ? 'Пока нет достижений' : 'Мҿы адостижениақәа ыҟам'}</h3>
                  <p>
                    {language === 'ru' 
                      ? 'Читайте книги и выполняйте задания, чтобы получить первые достижения!'
                      : 'Алибрақәа ҧхьатәуп, азадачақәа ҟатәуп, иацҵу адостижениақәа рыҟара!'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className={styles.activityTab}>
              <div className={styles.activityList}>
                {recentActivity.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {activity.type === 'reading' ? '📖' : '📝'}
                    </div>
                    <div className={styles.activityContent}>
                      {activity.type === 'reading' ? (
                        <>
                          <div className={styles.activityTitle}>
                            {language === 'ru' ? 'Чтение:' : 'Аҧхьара:'} {activity.book}
                          </div>
                          <div className={styles.activityDetails}>
                            {language === 'ru' ? 'Прогресс:' : 'Апрогресс:'} {activity.progress}%
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.activityTitle}>
                            {activity.title}
                          </div>
                          <div className={styles.activityDetails}>
                            {language === 'ru' ? 'Результат:' : 'Арезультат:'} {activity.score}%
                          </div>
                        </>
                      )}
                      <div className={styles.activityDate}>
                        {formatDate(activity.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;