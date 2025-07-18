import api from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { setUser } from "../slices/userSlice";

// ✅ 1. Submit Verification
export const submitVerification = async (formData, dispatch) => {
  try {
    const response = await api.put("/citizen/submitVerification", {
      data: formData,
    });

    if (response.data.success) {
      dispatch(setUser({ user: response.data.user, logedAt: Date.now() }));
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

export const getComplaint = async () => {
  const res = await api.get('/citizen/getComplaint');
  if (!res.data.success) throw new Error(res.data.message);
  return res.data.complaints; // Only return actual data
};


// ✅ 3. Submit Complaint
export const submitComplaint = async (payload) => {
  const response = await api.post('/citizen/submitComplaint', payload);

  if (response.data.success) {
    return response.data.complaint; // ✅ return the new complaint object directly
  } else {
    throw new Error(response.data.message || 'Submission failed');
  }
};


export const deleteComplaint = async (id) => {
  try {
    const response = await api.delete(`/citizen/deleteComplaint/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete complaint error:', error);
    throw error.response?.data || { message: 'Server error' };
  }
};

export const getAllMissingAndCriminalsForUser = async (pincode = null) => {
  const url = pincode
    ? `/citizen/getAllMissingAndCriminalsForUser?pincode=${pincode}`
    : `/citizen/getAllMissingAndCriminalsForUser`;

  const res = await api.get(url);
  return res.data;
};
export const submitLead=async(data)=>{
    const res=await api.post('/citizen/submitLead',data);
    return res.data;
}

export const getTopContributorsInArea = async () => {
  const response = await api.get('/citizen/getTopContributorsInArea');
  return response.data; 
};

export const submitSighting = async (sightingData) => {
  const response = await api.post('/citizen/createSightingUpdate', sightingData);
  return response.data;
};