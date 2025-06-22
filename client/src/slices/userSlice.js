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
      state.logedAt = Date.now(); // ✅ fix here
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
      state.logedAt = Date.now(); // ✅ fix here
    },
  },
});

// ✅ Corrected named exports
export const { setUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
