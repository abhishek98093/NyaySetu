// api.js
import axios from "axios";
const API_BASE = "http://localhost:3000"; // or your API URL
import { toast } from "react-toastify";
import { addComplaint, setComplaints } from "../../slices/complaintSlice";
import { set } from "zod";
import { setUser } from "../../slices/userSlice";

export const submitVerification = async (formData,dispatch) => {
  try {
    const token = localStorage.getItem("token"); // Or wherever you're storing it

    const response = await axios.put(
      `${API_BASE}/api/citizen/submitVerification`,
      { data: formData },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      dispatch(setUser({user:response.data.user,logedAt:Date.now()}));
      toast.success(response.data.message || "Submitted successfully!");
      return { success: true };
    } else {
      toast.error(response.data.message || "Submission failed.");
      return { success: false };
    }
  } catch (error) {
    console.error("Error submitting verification:", error);
    toast.error("Server error while submitting.");
    return { success: false };
  }
};


export const getComplaint = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE}/api/citizen/getComplaint`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      dispatch(setComplaints({
  complaints: response.data.complaints,
  loadedAt: Date.now()
}));
      toast.success(response.data.message || "Fetched successfully!");
      return { success: true};
    } else {
      toast.error(response.data.message || "Failed to fetch.");
      return { success: false };
    }
  } catch (error) {
    console.error("Error fetching complaints:", error);
    toast.error("Server error while fetching complaints.");
    return { success: false };
  }
};