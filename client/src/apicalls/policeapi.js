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


export const getAllMissingAndCriminals = async () => {
  const res = await api.get('/police/getAllMissingAndCriminals');

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch data");
  }

  console.log(res.data);
  return res.data;
};

export const addCriminal = async (formData) => {
  const res = await api.post('/police/addCriminal', formData);

  if (res.status !== 201) {
    throw new Error(`Failed to add criminal: ${res.status} ${res.statusText}`);
  }

  return res.data;
};

export const addMissingPerson = async (formData) => {
  const res = await api.post('/police/addMissingPerson', formData);

  if (res.status !== 201) {
    throw new Error(`Failed to add criminal: ${res.status} ${res.statusText}`);
  }

  return res.data;
};

export const deleteMissingPerson = async (id) => {
  const res = await api.delete(`/police/deleteMissingPerson/${id}`);
  if (res.status !== 200 && res.status !== 204) {
    throw new Error(`Failed to delete missing person: ${res.status} ${res.statusText}`);
  }
  return res.data;
};

export const deleteCriminal = async (id) => {
  const res = await api.delete(`/police/deleteCriminal/${id}`);
  if (res.status !== 200 && res.status !== 204) {
    throw new Error(`Failed to delete criminal: ${res.status} ${res.statusText}`);
  }
  return res.data;
};

export const updateMissingPerson = async ({ id, data }) => {
  console.log(data);
  const res = await api.put(`/police/updateMissingPerson/${id}`, data);
  return res.data; 
};

export const updateCriminal=async({id,data})=>{
  const res=await api.put(`/police/updateCriminal/${id}`,data);
  return res.data;
}

