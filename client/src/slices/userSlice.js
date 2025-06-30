import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  policeDetails: null,
  logedAt: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.policeDetails = action.payload.policeDetails || null; // ✅ add policeDetails if present
      state.logedAt = Date.now();
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
      state.policeDetails = action.payload.policeDetails || state.policeDetails;
      state.logedAt = Date.now();
    },
    resetUser: () => initialState,
  },
});

export const { setUser, updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
