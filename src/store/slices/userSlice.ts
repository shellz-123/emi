import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User, Skill} from '../../types';

interface UserState {
  currentUser: User | null;
  isOnboarded: boolean;
  learningStreak: number;
  totalLearningHours: number;
  certificates: string[];
}

const initialState: UserState = {
  currentUser: null,
  isOnboarded: false,
  learningStreak: 0,
  totalLearningHours: 0,
  certificates: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    completeOnboarding: (state) => {
      state.isOnboarded = true;
    },
    updateSkills: (state, action: PayloadAction<Skill[]>) => {
      if (state.currentUser) {
        state.currentUser.skills = action.payload;
      }
    },
    updateAssessmentScore: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.assessmentScore = action.payload;
      }
    },
    addCompletedCourse: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.completedCourses.push(action.payload);
      }
    },
    incrementLearningStreak: (state) => {
      state.learningStreak += 1;
    },
    addLearningHours: (state, action: PayloadAction<number>) => {
      state.totalLearningHours += action.payload;
    },
    addCertificate: (state, action: PayloadAction<string>) => {
      state.certificates.push(action.payload);
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {...state.currentUser, ...action.payload};
      }
    },
    // NEW: Reset user state
    resetUserState: (state) => {
      state.currentUser = null;
      state.isOnboarded = false;
      state.learningStreak = 0;
      state.totalLearningHours = 0;
      state.certificates = [];
    },
  },
});

export const {
  setUser,
  completeOnboarding,
  updateSkills,
  updateAssessmentScore,
  addCompletedCourse,
  incrementLearningStreak,
  addLearningHours,
  addCertificate,
  updateUserProfile,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
