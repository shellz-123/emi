import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {Course} from '../../types';
import {mockCourses} from '../../utils/mockData';

interface CoursesState {
  allCourses: Course[];
  enrolledCourses: Course[];
  recommendedCourses: Course[];
  completedCourses: Course[];
  currentCourse: Course | null;
  learningPath: Course[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CoursesState = {
  allCourses: [],
  enrolledCourses: [],
  recommendedCourses: [],
  completedCourses: [],
  currentCourse: null,
  learningPath: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Async thunk to load courses - SIMPLIFIED VERSION USING MOCK DATA
 */
export const loadCourses = createAsyncThunk(
  'courses/loadCourses',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data instead of CSV
      console.log('✅ Loaded mock courses');
      return mockCourses;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load courses');
    }
  }
);

/**
 * Async thunk to refresh courses data
 */
export const refreshCourses = createAsyncThunk(
  'courses/refreshCourses',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCourses;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to refresh courses');
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.allCourses = action.payload;
      state.lastUpdated = Date.now();
    },
    
    setRecommendedCourses: (state, action: PayloadAction<Course[]>) => {
      state.recommendedCourses = action.payload;
    },
    
    enrollCourse: (state, action: PayloadAction<Course>) => {
      const courseExists = state.enrolledCourses.find(
        c => c.id === action.payload.id
      );
      if (!courseExists) {
        state.enrolledCourses.push({...action.payload, progress: 0});
      }
    },
    
    unenrollCourse: (state, action: PayloadAction<string>) => {
      state.enrolledCourses = state.enrolledCourses.filter(
        c => c.id !== action.payload
      );
    },
    
    updateCourseProgress: (
      state,
      action: PayloadAction<{courseId: string; progress: number}>
    ) => {
      const course = state.enrolledCourses.find(
        c => c.id === action.payload.courseId
      );
      if (course) {
        course.progress = action.payload.progress;
        if (action.payload.progress === 100) {
          const alreadyCompleted = state.completedCourses.find(
            c => c.id === course.id
          );
          if (!alreadyCompleted) {
            state.completedCourses.push(course);
          }
        }
      }
    },
    
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(loadCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCourses = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(loadCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    builder
      .addCase(refreshCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCourses = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(refreshCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCourses,
  setRecommendedCourses,
  enrollCourse,
  unenrollCourse,
  updateCourseProgress,
  setCurrentCourse,
  clearError,
} = coursesSlice.actions;

export default coursesSlice.reducer;
