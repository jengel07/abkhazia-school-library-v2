import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  userType: null, // 'student', 'teacher', 'parent'
  language: 'ru',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.userType = action.payload.userType;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userType = null;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { login, logout, setLanguage } = authSlice.actions;
export default authSlice.reducer;