import { createSlice } from '@reduxjs/toolkit';

const mockAssignments = [
  {
    id: 1,
    title: 'Прочитать главу 1 - Натуральные числа',
    bookId: 1,
    teacherId: 1,
    studentIds: [1, 2, 3],
    dueDate: '2025-01-25',
    description: 'Изучить материал о натуральных числах и выполнить упражнения',
    questions: [
      {
        id: 1,
        type: 'multiple',
        question: 'Какое из чисел является натуральным?',
        options: ['0', '1', '-1', '0.5'],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: 'text',
        question: 'Объясните, что такое натуральные числа',
        correctAnswer: 'Натуральные числа - это числа, которые используются для счета предметов',
      },
    ],
    status: 'active',
    createdAt: '2025-01-18',
  },
  {
    id: 2,
    title: 'История древней Абхазии',
    bookId: 2,
    teacherId: 2,
    studentIds: [1, 4, 5],
    dueDate: '2025-01-30',
    description: 'Изучить первые главы о древней истории Абхазии',
    questions: [
      {
        id: 3,
        type: 'multiple',
        question: 'В каком веке появились первые поселения в Абхазии?',
        options: ['V век до н.э.', 'III век до н.э.', 'I век н.э.', 'V век н.э.'],
        correctAnswer: 0,
      },
    ],
    status: 'active',
    createdAt: '2025-01-17',
  },
];

const initialState = {
  assignments: mockAssignments,
  userAssignments: [],
  completedAssignments: [],
  loading: false,
};

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    createAssignment: (state, action) => {
      const newAssignment = {
        ...action.payload,
        id: Date.now(),
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.assignments.push(newAssignment);
    },
    completeAssignment: (state, action) => {
      const { assignmentId, studentId, answers, score } = action.payload;
      const completion = {
        assignmentId,
        studentId,
        answers,
        score,
        completedAt: new Date().toISOString(),
      };
      state.completedAssignments.push(completion);
    },
    setUserAssignments: (state, action) => {
      state.userAssignments = action.payload;
    },
  },
});

export const { createAssignment, completeAssignment, setUserAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;