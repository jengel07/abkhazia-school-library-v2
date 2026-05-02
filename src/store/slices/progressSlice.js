import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  readingProgress: {},
  scores: {},
  achievements: [],
  totalPoints: 0,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    updateReadingProgress: (state, action) => {
      const { bookId, progress } = action.payload;
      state.readingProgress[bookId] = progress;
      
      // Добавляем баллы за прогресс чтения
      if (progress === 100 && !state.scores[`book_${bookId}`]) {
        state.scores[`book_${bookId}`] = 10;
        state.totalPoints += 10;
      }
    },
    addScore: (state, action) => {
      const { type, points, id } = action.payload;
      const scoreKey = `${type}_${id}`;
      if (!state.scores[scoreKey]) {
        state.scores[scoreKey] = points;
        state.totalPoints += points;
      }
    },
    addAchievement: (state, action) => {
      state.achievements.push({
        ...action.payload,
        earnedAt: new Date().toISOString(),
      });
    },
  },
});

export const { updateReadingProgress, addScore, addAchievement } = progressSlice.actions;
export default progressSlice.reducer;