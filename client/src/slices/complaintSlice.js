import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  complaints: [],
  loadedAt: null, // ⏱️ timestamp of last load
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    addComplaint: (state, action) => {
      state.complaints.unshift(action.payload.complaint);
    },
    setComplaints: (state, action) => {
      state.complaints = action.payload.complaints;
      state.loadedAt = Date.now(); // ✅ store timestamp when data is set
    },
    updateComplaint: (state, action) => {
      const updated = action.payload.complaint;
      const index = state.complaints.findIndex(c => c.complaint_id === updated.complaint_id);
      if (index !== -1) {
        state.complaints[index] = updated;
      }
    },
    deleteComplaint: (state, action) => {
      const deleted = action.payload.complaint;
      state.complaints = state.complaints.filter(c => c.complaint_id !== deleted.complaint_id);
    },
    resetComplaint: () => initialState, // ✅ resets to initialState
  },
});

// ✅ You missed exporting resetComplaint here
export const {
  addComplaint,
  setComplaints,
  updateComplaint,
  deleteComplaint,
  resetComplaint, // ✅ now it's exported
} = complaintSlice.actions;

export default complaintSlice.reducer;
