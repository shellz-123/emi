import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import coursesReducer from './slices/coursesSlice';
import jobsReducer from './slices/jobsSlice';


// Simple store - no persistence, no CSV loading
export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: coursesReducer,
    jobs: jobsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;