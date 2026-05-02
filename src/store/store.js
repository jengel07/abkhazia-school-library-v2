import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import assignmentsReducer from './slices/assignmentsSlice';
import progressReducer from './slices/progressSlice';
import notesReducer from './slices/notesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    assignments: assignmentsReducer,
    progress: progressReducer,
    notes: notesReducer,
  },
});