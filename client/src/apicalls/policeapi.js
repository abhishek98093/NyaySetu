import api from "../utils/axiosInstance"; // Replaces axios
import { toast } from "react-toastify";
const API_BASE = import.meta.env.VITE_API_BASE;


export const getPoliceComplaints = async () => {
    console.log('backend hit');
  const res = await api.get("/police/getPoliceComplaints");

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch complaints");
  }

  return res.data;
};

export const assignOfficer = async ({ complaint_id, officer_id }) => {
  try {
    const response = await api.post('/police/assignOfficerToComplaint', {
      complaint_id: complaint_id,
      police_id: officer_id
    });
    if (response.data?.success) {
      return response.data; 
    } else {
      throw new Error(response.data?.message || 'Failed to assign officer');
    }

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Server error');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message || 'Error assigning officer');
    }
  }
};
