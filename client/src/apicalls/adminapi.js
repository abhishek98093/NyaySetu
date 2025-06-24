import axios from "axios";
// const API_BASE = "http://localhost:3000"; // or your API URL
const API_BASE = import.meta.env.VITE_API_BASE;

import { toast } from "react-toastify";


export const fetchStats = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error("You must be logged in to view stats.");
      return { success: false, error: 'Unauthorized' };
    }

    const response = await axios.get(`${API_BASE}/api/admin/fetchStats`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // ✅ Check and return stats
    const data = response.data;

    if (data.success) {
      return {
        success: true,
        statusStats: data.statusStats,
        monthWiseStats: data.monthWiseStats,
      };
    } else {
      return { success: false, error: data.error || 'Unknown error' };
    }

  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Server error',
    };
  }
};

export 
const fetchFilteredPolice = async ({filters,page=1,limit=20}) => {
    const token=localStorage.getItem("token");
    if(!token){
      toast.error('please login first,Not authorised');
      return;
    }
  try {
    const response = await axios.get(`${API_BASE}/api/admin/getFilteredPolice`, {
      params: {
        rank: filters.rank || undefined,       // only include if not empty
        pincode: filters.pincode || undefined,
        gender: filters.gender || undefined,
        station_code:filters.station_code || undefined,
        badge_number:filters.badge_number || undefined,
        page,
        limit

      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if(response.data.success){
      return {success:true,police:response.data.police,total:response.data.total};
    }else{
      toast.error(response.error.message);
      return {success:false};
    }
  } catch (err) {
    console.error("Error fetching police:", err);
    toast.error(`Enter all valid field , pincode and badge number`);
  }
};


export const registerPoliceOfficer = async (formData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }


  try {
    const response = await axios.post(
      `${API_BASE}/api/admin/createPoliceOfficer`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      toast.success(response.data.message || "Officer registered successfully.");
      return { success: true ,data:response.data.data};
    } else {
      toast.error(response.data.message || "Something went wrong.");
      return { success: false };
    }
  } catch (error) {
    console.error("API error:", error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Request failed.";
      toast.error(`Error ${status}: ${message}`);
    } else if (error.request) {
      toast.error("No response from server. Check your network.");
    } else {
      toast.error(`Error: ${error.message}`);
    }

    return { success: false };
  }
};


export const deletePoliceOfficer = async (user_id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await axios.delete(`${API_BASE}/api/admin/deletePoliceOfficer`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { user_id }, 
    });

    if (response.data.success) {
      toast.success(response.data.message || "Officer deleted successfully.");
      return { success: true };
    } else {
      toast.error(response.data.message || "Something went wrong.");
      return { success: false };
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Request failed.";
      toast.error(`Error ${status}: ${message}`);
    } else if (error.request) {
      toast.error("No response from server. Check your network.");
    } else {
      toast.error(`Error: ${error.message}`);
    }
    return { success: false };
  }
};


export const changeOfficerRank = async (user_id, target_rank) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.put(`${API_BASE}/api/admin/updatePoliceRank`, {
      user_id,
      target_rank
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success(response.data.message);
      return { success: true, newRank: target_rank };
    } else {
      toast.error(response.data.message);
      return { success: false };
    }
  } catch (error) {
    toast.error("Something went wrong");
    return { success: false };
  }
};


export const getPolicePersonnelAnalysis = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error("You must be logged in to view stats.");
      return { success: false, error: 'Unauthorized' };
    }

    const response = await axios.get(`${API_BASE}/api/admin/getPolicePersonnelAnalysis`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (data.success && data.data) {
      return {
        success: true,
        stats: data.data, 
      };
    } else {
      return { success: false, error: data.message || 'Unknown error' };
    }

  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Server error',
    };
  }
};
