import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],
  highlights: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action) => {
      const newNote = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      state.notes.push(newNote);
    },
    updateNote: (state, action) => {
      const { id, content } = action.payload;
      const note = state.notes.find(n => n.id === id);
      if (note) {
        note.content = content;
        note.updatedAt = new Date().toISOString();
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    addHighlight: (state, action) => {
      const newHighlight = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      state.highlights.push(newHighlight);
    },
    removeHighlight: (state, action) => {
      state.highlights = state.highlights.filter(highlight => highlight.id !== action.payload);
    },
  },
});

export const { addNote, updateNote, deleteNote, addHighlight, removeHighlight } = notesSlice.actions;
export default notesSlice.reducer;