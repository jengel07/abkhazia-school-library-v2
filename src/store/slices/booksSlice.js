import { createSlice } from '@reduxjs/toolkit';

const mockBooks = [
  {
    id: 1,
    title: 'Математика 5 класс',
    author: 'Виленкин Н.Я.',
    subject: 'mathematics',
    grade: 5,
    type: 'textbook',
    format: 'PDF',
    pages: 280,
    downloadUrl: '/books/math-5.pdf',
    coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Учебник математики для 5 класса общеобразовательных учреждений',
  },
  {
    id: 2,
    title: 'История Абхазии',
    author: 'Анчабадзе З.В.',
    subject: 'history',
    grade: 8,
    type: 'textbook',
    format: 'EPUB',
    pages: 320,
    downloadUrl: '/books/abkhazia-history.epub',
    coverImage: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'История Абхазии с древнейших времен до наших дней',
  },
  {
    id: 3,
    title: 'Русская литература 9 класс',
    author: 'Коровина В.Я.',
    subject: 'literature',
    grade: 9,
    type: 'textbook',
    format: 'PDF',
    pages: 400,
    downloadUrl: '/books/literature-9.pdf',
    coverImage: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Учебник по русской литературе для 9 класса',
  },
  {
    id: 4,
    title: 'Физика 10 класс',
    author: 'Мякишев Г.Я.',
    subject: 'physics',
    grade: 10,
    type: 'textbook',
    format: 'PDF',
    pages: 366,
    downloadUrl: '/books/physics-10.pdf',
    coverImage: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Учебник физики для 10 класса базового и профильного уровней',
  },
];

const initialState = {
  books: mockBooks,
  filteredBooks: mockBooks,
  searchQuery: '',
  selectedSubject: 'all',
  selectedGrade: 'all',
  selectedType: 'all',
  loading: false,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredBooks = filterBooks(state);
    },
    setSubjectFilter: (state, action) => {
      state.selectedSubject = action.payload;
      state.filteredBooks = filterBooks(state);
    },
    setGradeFilter: (state, action) => {
      state.selectedGrade = action.payload;
      state.filteredBooks = filterBooks(state);
    },
    setTypeFilter: (state, action) => {
      state.selectedType = action.payload;
      state.filteredBooks = filterBooks(state);
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedSubject = 'all';
      state.selectedGrade = 'all';
      state.selectedType = 'all';
      state.filteredBooks = state.books;
    },
  },
});

function filterBooks(state) {
  return state.books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesSubject = state.selectedSubject === 'all' || book.subject === state.selectedSubject;
    const matchesGrade = state.selectedGrade === 'all' || book.grade.toString() === state.selectedGrade;
    const matchesType = state.selectedType === 'all' || book.type === state.selectedType;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesType;
  });
}

export const { setSearchQuery, setSubjectFilter, setGradeFilter, setTypeFilter, clearFilters } = booksSlice.actions;
export default booksSlice.reducer;