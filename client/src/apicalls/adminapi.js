import axios from "axios";
const API_BASE = "http://localhost:3000"; // or your API URL
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
    toast.error(`Error fetching required details: ${err}`)
  }
};