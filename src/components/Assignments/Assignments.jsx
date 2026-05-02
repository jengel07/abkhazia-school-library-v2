import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createAssignment, completeAssignment } from '../../store/slices/assignmentsSlice';
import { addScore } from '../../store/slices/progressSlice';
import { t } from '../../utils/translations';
import styles from './Assignments.module.css';

const Assignments = () => {
  const dispatch = useDispatch();
  const { user, userType, language } = useSelector(state => state.auth);
  const { assignments, completedAssignments } = useSelector(state => state.assignments);
  const { books } = useSelector(state => state.books);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    bookId: '',
    dueDate: '',
    description: '',
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const getUserAssignments = () => {
    if (userType === 'student') {
      return assignments.filter(assignment => 
        assignment.studentIds.includes(user.id) || assignment.studentIds.includes(1)
      );
    }
    return assignments;
  };

  const getCompletedAssignmentIds = () => {
    return completedAssignments
      .filter(completion => completion.studentId === user.id)
      .map(completion => completion.assignmentId);
  };

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.bookId && newAssignment.dueDate) {
      dispatch(createAssignment({
        ...newAssignment,
        teacherId: user.id,
        studentIds: [1, 2, 3, 4, 5] // Демо студенты
      }));
      setNewAssignment({
        title: '',
        bookId: '',
        dueDate: '',
        description: '',
        questions: []
      });
      setShowCreateForm(false);
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.question) {
      setNewAssignment({
        ...newAssignment,
        questions: [...newAssignment.questions, { ...newQuestion, id: Date.now() }]
      });
      setNewQuestion({
        type: 'multiple',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  const handleSubmitAssignment = (assignment) => {
    let score = 0;
    const totalQuestions = assignment.questions.length;
    
    assignment.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'multiple' && userAnswer === question.correctAnswer) {
        score += 1;
      } else if (question.type === 'text' && userAnswer && userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase())) {
        score += 1;
      }
    });

    const finalScore = Math.round((score / totalQuestions) * 100);
    
    dispatch(completeAssignment({
      assignmentId: assignment.id,
      studentId: user.id,
      answers,
      score: finalScore
    }));

    dispatch(addScore({
      type: 'assignment',
      points: finalScore >= 70 ? 20 : 10,
      id: assignment.id
    }));

    setSelectedAssignment(null);
    setAnswers({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Неизвестная книга';
  };

  const userAssignments = getUserAssignments();
  const completedIds = getCompletedAssignmentIds();

  return (
    <div className={styles.assignments}>
      <div className={styles.assignmentsHeader}>
        <h1 className={styles.assignmentsTitle}>
          {t('assignments', language)}
        </h1>
        {userType === 'teacher' && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className={styles.createButton}
          >
            ➕ {t('createAssignment', language)}
          </button>
        )}
      </div>

      {userType === 'student' && (
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div className={styles.statValue}>{userAssignments.length}</div>
            <div className={styles.statLabel}>
              {language === 'ru' ? 'Всего заданий' : 'Азадачақәа зегьы'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statValue}>{completedIds.length}</div>
            <div className={styles.statLabel}>
              {language === 'ru' ? 'Выполнено' : 'Иҟоуп'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏰</div>
            <div className={styles.statValue}>
              {userAssignments.filter(a => !completedIds.includes(a.id)).length}
            </div>
            <div className={styles.statLabel}>
              {language === 'ru' ? 'Осталось' : 'Иҭацәуп'}
            </div>
          </div>
        </div>
      )}

      <div className={styles.assignmentsList}>
        {userAssignments.length > 0 ? (
          userAssignments.map(assignment => {
            const isCompleted = completedIds.includes(assignment.id);
            const overdue = isOverdue(assignment.dueDate);
            
            return (
              <div 
                key={assignment.id} 
                className={`${styles.assignmentCard} ${isCompleted ? styles.completed : ''} ${overdue && !isCompleted ? styles.overdue : ''}`}
              >
                <div className={styles.assignmentHeader}>
                  <h3 className={styles.assignmentTitle}>{assignment.title}</h3>
                  <div className={styles.assignmentMeta}>
                    <span className={styles.bookTag}>
                      📚 {getBookTitle(assignment.bookId)}
                    </span>
                    <span className={`${styles.dueDate} ${overdue && !isCompleted ? styles.overdueDate : ''}`}>
                      📅 {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                </div>

                <p className={styles.assignmentDescription}>
                  {assignment.description}
                </p>

                <div className={styles.assignmentStats}>
                  <span className={styles.questionsCount}>
                    ❓ {assignment.questions.length} {language === 'ru' ? 'вопросов' : 'азҵаарақәа'}
                  </span>
                  {userType === 'teacher' && (
                    <span className={styles.studentsCount}>
                      👥 {assignment.studentIds.length} {language === 'ru' ? 'учеников' : 'аҟәҵаҩцәа'}
                    </span>
                  )}
                </div>

                <div className={styles.assignmentActions}>
                  {userType === 'student' && !isCompleted && (
                    <button 
                      onClick={() => setSelectedAssignment(assignment)}
                      className={styles.startButton}
                    >
                      🚀 {language === 'ru' ? 'Начать выполнение' : 'Аҟәыхра алагара'}
                    </button>
                  )}
                  {userType === 'student' && isCompleted && (
                    <div className={styles.completedBadge}>
                      ✅ {language === 'ru' ? 'Выполнено' : 'Иҟоуп'}
                    </div>
                  )}
                  {userType === 'teacher' && (
                    <button className={styles.viewResultsButton}>
                      📊 {language === 'ru' ? 'Результаты' : 'Арезультатқәа'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3 className={styles.emptyTitle}>
              {language === 'ru' ? 'Заданий пока нет' : 'Азадачақәа мҿы ыҟам'}
            </h3>
            <p className={styles.emptyText}>
              {userType === 'teacher' 
                ? (language === 'ru' ? 'Создайте первое задание для своих учеников' : 'Шәҟәҵаҩцәа рзы иацҵу азадача ҿыц')
                : (language === 'ru' ? 'Учитель пока не назначил заданий' : 'Аҟәҵаҩы мҿы азадачақәа ыҟамызт')
              }
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно создания задания */}
      {showCreateForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{t('createAssignment', language)}</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {t('assignmentTitle', language)}
              </label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                className={styles.formInput}
                placeholder={language === 'ru' ? 'Введите название задания' : 'Азадача ахьӡ ҭажәгал'}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {language === 'ru' ? 'Книга' : 'Алибра'}
              </label>
              <select
                value={newAssignment.bookId}
                onChange={(e) => setNewAssignment({...newAssignment, bookId: parseInt(e.target.value)})}
                className={styles.formSelect}
              >
                <option value="">{language === 'ru' ? 'Выберите книгу' : 'Алибра алхра'}</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {t('dueDate', language)}
              </label>
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {t('description', language)}
              </label>
              <textarea
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                className={styles.formTextarea}
                placeholder={language === 'ru' ? 'Описание задания' : 'Азадача аописаниа'}
              />
            </div>

            <div className={styles.questionsSection}>
              <h3>{t('questions', language)}</h3>
              
              <div className={styles.questionForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {language === 'ru' ? 'Тип вопроса' : 'Азҵаара атип'}
                  </label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                    className={styles.formSelect}
                  >
                    <option value="multiple">{language === 'ru' ? 'Множественный выбор' : 'Рыбжьара алхра'}</option>
                    <option value="text">{language === 'ru' ? 'Текстовый ответ' : 'Атекстуа жәаҧ'}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {language === 'ru' ? 'Вопрос' : 'Азҵаара'}
                  </label>
                  <input
                    type="text"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    className={styles.formInput}
                    placeholder={language === 'ru' ? 'Введите вопрос' : 'Азҵаара ҭажәгал'}
                  />
                </div>

                {newQuestion.type === 'multiple' && (
                  <div className={styles.optionsGroup}>
                    <label className={styles.formLabel}>
                      {language === 'ru' ? 'Варианты ответов' : 'Жәаҧқәа рвариантқәа'}
                    </label>
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className={styles.optionInput}>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[index] = e.target.value;
                            setNewQuestion({...newQuestion, options: newOptions});
                          }}
                          className={styles.formInput}
                          placeholder={`${language === 'ru' ? 'Вариант' : 'Авариант'} ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={newQuestion.correctAnswer === index}
                          onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  onClick={handleAddQuestion}
                  className={styles.addQuestionButton}
                >
                  ➕ {t('addQuestion', language)}
                </button>
              </div>

              {newAssignment.questions.length > 0 && (
                <div className={styles.questionsList}>
                  <h4>{language === 'ru' ? 'Добавленные вопросы:' : 'Ицҵоу азҵаарақәа:'}</h4>
                  {newAssignment.questions.map((question, index) => (
                    <div key={question.id} className={styles.questionItem}>
                      <strong>{index + 1}. {question.question}</strong>
                      {question.type === 'multiple' && (
                        <ul>
                          {question.options.map((option, optIndex) => (
                            <li key={optIndex} className={optIndex === question.correctAnswer ? styles.correctOption : ''}>
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button 
                onClick={handleCreateAssignment}
                className={styles.saveButton}
                disabled={!newAssignment.title || !newAssignment.bookId || !newAssignment.dueDate}
              >
                💾 {t('save', language)}
              </button>
              <button 
                onClick={() => setShowCreateForm(false)}
                className={styles.cancelButton}
              >
                {t('cancel', language)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно выполнения задания */}
      {selectedAssignment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{selectedAssignment.title}</h2>
              <button 
                onClick={() => setSelectedAssignment(null)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div className={styles.assignmentInfo}>
              <p><strong>{language === 'ru' ? 'Книга:' : 'Алибра:'}</strong> {getBookTitle(selectedAssignment.bookId)}</p>
              <p><strong>{language === 'ru' ? 'Срок сдачи:' : 'Аҟәыхра амш:'}</strong> {formatDate(selectedAssignment.dueDate)}</p>
              <p><strong>{language === 'ru' ? 'Описание:' : 'Аописаниа:'}</strong> {selectedAssignment.description}</p>
            </div>

            <div className={styles.questionsContainer}>
              {selectedAssignment.questions.map((question, index) => (
                <div key={question.id} className={styles.questionBlock}>
                  <h4>{index + 1}. {question.question}</h4>
                  
                  {question.type === 'multiple' ? (
                    <div className={styles.optionsContainer}>
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className={styles.optionLabel}>
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            value={optIndex}
                            onChange={(e) => setAnswers({
                              ...answers,
                              [question.id]: parseInt(e.target.value)
                            })}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      className={styles.textAnswer}
                      placeholder={language === 'ru' ? 'Введите ваш ответ...' : 'Шәжәаҧ ҭажәгал...'}
                      onChange={(e) => setAnswers({
                        ...answers,
                        [question.id]: e.target.value
                      })}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button 
                onClick={() => handleSubmitAssignment(selectedAssignment)}
                className={styles.submitButton}
              >
                ✅ {t('submit', language)}
              </button>
              <button 
                onClick={() => setSelectedAssignment(null)}
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

export default Assignments;