// api.js
import axios from "axios";
const API_BASE = "http://localhost:3000"; // or your API URL
import { toast } from "react-toastify";

export const fetchUserDetails = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/api/citizen/userDetails`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
    if (res.data.success) {
      return { success: true, result: res.data.user };
    } else {
      return { success: false, result: res.data.message || "Could not fetch user details." };
    }
  } catch (err) {
    return {
      success: false,
      result: err.response?.data?.message || "Something went wrong."
    };
  }
};

export const submitVerification = async (formData) => {
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
      toast.success(response.data.message || "Submitted successfully!");
      return { success: true, user: response.data.user };
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
