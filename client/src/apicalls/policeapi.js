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

export const getFilteredLeads = async ({ data }) => {
  console.log('api hit ');
  try {
    const res = await api.post('/police/getFilteredLeads', data);
    console.log(res.data);
    return res.data; 
  } catch (err) {
    throw err.response?.data || err;
  }
};


export const awardStar = async ({ user_id }) => {
  try {
    const res = await api.post('/police/awardStar', { user_id });
    return res.data; 
  } catch (error) {
    console.error('Error awarding star:', error);
    throw error; 
  }
};

export const getLeads = async (criminalId) => {
  try {
    const res = await api.get(`/police/criminal/${criminalId}`);
    console.log('api hit');
    console.log(res.data);
    return res.data; // assuming the backend returns { leads: [...] }
  } catch (error) {
    console.error('Error fetching leads:', error.response?.data || error.message);
    throw error;
  }
};

export const getMissingLeads = async (missingId) => {
  try {


    const res = await api.get(`/police/missing/${missingId}`);
    console.log(res.data);
    return res.data; // assuming the backend returns { leads: [...] }
  } catch (error) {
    console.error('Error fetching leads:', error.response?.data || error.message);
    throw error;
  }
};

export const updateComplaintStatus = async ({ complaintId, status, remark }) => {
  try {
    const res = await api.put(`/police/complaints/${complaintId}`, {
      status,
      remark,
    });
    return res.data;
  } catch (err) {
    console.error('Error updating complaint:', err.response?.data || err.message);
    throw err;
  }
};



export const uploadCaseFile = async ({complaintId, case_file_url}) => {
  try {
    // Trim and basic validation
    if (typeof case_file_url !== 'string' || case_file_url.trim() === '') {
      throw new Error('Invalid or empty case file URL');
    }

    const res = await api.put(`/police/uploadcasefile/${complaintId}/`, {
      case_file_url: case_file_url.trim(),
    });

    return res.data;
  } catch (err) {
    console.error('Error uploading case file:', err.response?.data || err.message);
    throw new Error(
      err.response?.data?.error || 'Failed to upload case file. Please try again.'
    );
  }
};

export const getPendingUsersByPincode = async (pincode) => {
  try {
    const res = await api.get(`/police/pending/${pincode}`);
    
    if (!res.data || !Array.isArray(res.data.users)) {
      throw new Error('Invalid response format');
    }

    return res.data.users;
  } catch (err) {
    console.error('Error fetching pending users:', err.response?.data || err.message);
    throw new Error(err.response?.data?.error || 'Failed to fetch pending users');
  }
};

export const updateUserVerificationStatus = async ({ userId, status }) => {
  try {
    const res = await api.put(`/police/verify/${userId}`, { status });

    if (!res.data?.success) {
      throw new Error(res.data?.message || 'Failed to update status');
    }

    return res.data;
  } catch (err) {
    console.error('Error updating verification status:', err.response?.data || err.message);
    throw new Error(err.response?.data?.error || 'Failed to update verification status');
  }
};


