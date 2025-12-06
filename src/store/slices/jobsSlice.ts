import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Job} from '../../types';

interface JobsState {
  allJobs: Job[];
  matchedJobs: Job[];
  savedJobs: string[];
}

const initialState: JobsState = {
  allJobs: [],
  matchedJobs: [],
  savedJobs: [],
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.allJobs = action.payload;
    },
    setMatchedJobs: (state, action: PayloadAction<Job[]>) => {
      state.matchedJobs = action.payload;
    },
    toggleSaveJob: (state, action: PayloadAction<string>) => {
      const index = state.savedJobs.indexOf(action.payload);
      if (index > -1) {
        state.savedJobs.splice(index, 1);
      } else {
        state.savedJobs.push(action.payload);
      }
    },
  },
});

export const {setJobs, setMatchedJobs, toggleSaveJob} = jobsSlice.actions;

export default jobsSlice.reducer;