import { configureStore, createSlice } from '@reduxjs/toolkit';

const sourceSlice = createSlice({
  name: 'source',
  initialState: { fromDonate: null },
  reducers: {
    setSource: (state, action) => {
      state.fromDonate = action.payload;
    },
    clearSource: (state) => {
      state.fromDonate = null;
    }
  }
});

export const { setSource, clearSource } = sourceSlice.actions;

const store = configureStore({
  reducer: {
    source: sourceSlice.reducer
  }
});

export default store;
