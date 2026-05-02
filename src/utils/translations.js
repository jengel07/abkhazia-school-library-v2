export const translations = {
  ru: {
    // Общие
    login: 'Войти',
    logout: 'Выйти',
    search: 'Поиск',
    filter: 'Фильтр',
    all: 'Все',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    back: 'Назад',
    next: 'Далее',
    submit: 'Отправить',
    loading: 'Загрузка...',
    
    // Навигация
    catalog: 'Каталог',
    dashboard: 'Личный кабинет',
    assignments: 'Задания',
    progress: 'Прогресс',
    notes: 'Заметки',
    
    // Авторизация
    username: 'Имя пользователя',
    password: 'Пароль',
    userType: 'Тип пользователя',
    student: 'Ученик',
    teacher: 'Учитель',
    parent: 'Родитель',
    
    // Каталог книг
    books: 'Книги',
    subjects: 'Предметы',
    grades: 'Классы',
    bookTypes: 'Типы книг',
    textbook: 'Учебник',
    fiction: 'Художественная литература',
    reference: 'Справочник',
    download: 'Скачать',
    read: 'Читать',
    
    // Предметы
    mathematics: 'Математика',
    physics: 'Физика',
    chemistry: 'Химия',
    biology: 'Биология',
    history: 'История',
    literature: 'Литература',
    geography: 'География',
    
    // Прогресс
    totalPoints: 'Всего баллов',
    readingProgress: 'Прогресс чтения',
    completedAssignments: 'Выполненные задания',
    achievements: 'Достижения',
    
    // Задания
    createAssignment: 'Создать задание',
    assignmentTitle: 'Название задания',
    dueDate: 'Срок выполнения',
    description: 'Описание',
    questions: 'Вопросы',
    addQuestion: 'Добавить вопрос',
    
    // Заметки
    addNote: 'Добавить заметку',
    noteContent: 'Содержание заметки',
    highlights: 'Выделения',
  },
  ab: {
    // Общие
    login: 'Аҭагылара',
    logout: 'Ахыхра',
    search: 'Аҧшаара',
    filter: 'Агәыҧшра',
    all: 'Зегьы',
    save: 'Аиқәырхара',
    cancel: 'Аҟәыхра',
    delete: 'Аныхра',
    edit: 'Ариашара',
    back: 'Ашьҭахьҟа',
    next: 'Анаҩс',
    submit: 'Ашьҭра',
    loading: 'Иҭагалоуп...',
    
    // Навигация
    catalog: 'Акаталог',
    dashboard: 'Ауниверситет кабинет',
    assignments: 'Азадачақәа',
    progress: 'Апрогресс',
    notes: 'Азгәаҭақәа',
    
    // Авторизация
    username: 'Ахархәаҩ ахьӡ',
    password: 'Ажәамаӡа',
    userType: 'Ахархәаҩ атип',
    student: 'Аҟәҵаҩ',
    teacher: 'Аҟәҵаҩы',
    parent: 'Аԥшы',
    
    // Каталог книг
    books: 'Алибрақәа',
    subjects: 'Апредметқәа',
    grades: 'Акласқәа',
    bookTypes: 'Алибра атипқәа',
    textbook: 'Аучебник',
    fiction: 'Ахудожественны литература',
    reference: 'Асправочник',
    download: 'Аҭагалара',
    read: 'Аҧхьара',
    
    // Предметы
    mathematics: 'Аматематика',
    physics: 'Афизика',
    chemistry: 'Ахимиа',
    biology: 'Абиологиа',
    history: 'Аистториа',
    literature: 'Алитература',
    geography: 'Агеографиа',
    
    // Прогресс
    totalPoints: 'Абалқәа зегьы',
    readingProgress: 'Аҧхьара прогресс',
    completedAssignments: 'Иҟоу азадачақәа',
    achievements: 'Адостижениақәа',
    
    // Задания
    createAssignment: 'Азадача аҿыцра',
    assignmentTitle: 'Азадача ахьӡ',
    dueDate: 'Аҟәыхра амш',
    description: 'Аописаниа',
    questions: 'Азҵаарақәа',
    addQuestion: 'Азҵаара ацҵара',
    
    // Заметки
    addNote: 'Азгәаҭа ацҵара',
    noteContent: 'Азгәаҭа аҵанакы',
    highlights: 'Агәыҧшрақәа',
  },
};

export const t = (key, language = 'ru') => {
  return translations[language]?.[key] || translations.ru[key] || key;
};