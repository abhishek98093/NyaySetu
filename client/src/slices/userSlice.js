import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
  logedAt: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.logedAt = Date.now();
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
      state.logedAt = Date.now();
    },
    resetUser: () => initialState, // ✅ clean reset
  },
});

export const { setUser, updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
