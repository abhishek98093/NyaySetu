import api from "../utils/axiosInstance";
import { setUser } from "../slices/userSlice";

// ✅ 1. Send OTP
export const sendOtp = async (email) => {
  try {
    const response = await api.post("/auth/sendotp", { email });

    if (!response.data.success) {
      return { success: false, error: response.data.error || "Failed to send OTP" };
    }

    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.statusText ||
        error.message ||
        "Unknown error",
    };
  }
};

// ✅ 2. Signup
export const signup = async (formData, dispatch) => {
  try {
    const result = await api.post("/auth/signup", formData);

    if (result.data.token) {
      localStorage.setItem("token", result.data.token);
      dispatch(setUser({
  user: result.data.user,
  policeDetails: result.data.policeDetails, // ✅ add this line to store police details
  logedAt: Date.now(),
}));

      return { success: true };
    }

    return { success: false, message: result.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// ✅ 3. Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const result = await api.post("/auth/verify-otp", { email, otp });

    if (result.data.valid) {
      return { valid: true };
    }

    return { valid: false, error: "OTP is invalid or expired." };
  } catch (error) {
    return {
      valid: false,
      error:
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Network or server error.",
    };
  }
};

// ✅ 4. Login
export const login = async (formData, dispatch) => {
  try {
    const result = await api.post("/auth/login", formData);

    if (result.data.token) {
      localStorage.setItem("token", result.data.token);
      dispatch(setUser({
  user: result.data.user,
  policeDetails: result.data.policeDetails, // ✅ add this line to store police details
  logedAt: Date.now(),
}));

      return { success: true, token: result.data.token };
    }

    return { success: false, message: result.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// ✅ 5. Reset Password
export const resetPassword = async (formData, dispatch) => {
  try {
    const result = await api.patch("/auth/resetpassword", formData);

    if (result.data.token) {
      localStorage.setItem("token", result.data.token);
      dispatch(setUser({
  user: result.data.user,
  policeDetails: result.data.policeDetails, // ✅ add this line to store police details
  logedAt: Date.now(),
}));

      return { success: true, token: result.data.token };
    }

    return {
      success: false,
      error: "No token received after resetting password.",
      message: "System down, try again later.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message,
      message:
        error.response?.data?.message ||
        "No response from server or unknown error.",
    };
  }
};









// import axios from 'axios'
// // const API_BASE = 'http://localhost:3000';
// import {setUser} from '../slices/userSlice';
// const API_BASE = import.meta.env.VITE_API_BASE;


// export const sendOtp = async (email) => {
//     const data = {
//         email: email
//     };
    
//     try {
//         const response = await axios.post(`${API_BASE}/api/auth/sendotp`, data); 
//         if (!response.data.success) {
//             return { success: false, error: response.data.error || 'Failed to send OTP' };
//         }
//         return { success: true, message: response.data.message };
//     } catch (error) {
//         if (error.response) {
//             return { 
//                 success: false, 
//                 error: error.response.data.error || error.response.statusText 
//             };
//         } else if (error.request) {
//             return { success: false, error: 'No response from server' };
//         } else {
//             return { success: false, error: error.message };
//         }
//     }
// };
// export const signup = async (Formdata,dispatch) => {
//     const data = {
//         name:Formdata.name, 
//         email:Formdata.email,
//         password:Formdata.password,
//         phoneNumber:Formdata.phoneNumber,
//         dob:Formdata.dob
//      };

//     try {
//         const result = await axios.post(`${API_BASE}/api/auth/signup`, data);
//         if (result.data.token) {
//             localStorage.setItem("token", result.data.token);
//             dispatch(setUser({user:result.data.user,logedAt:Date.now()}));
//             console.log('use updated');
//             return {success:true};
//         }
//         return { success:false,message: result.data.message };
//     } catch (error) {
//         if (error.response) {
//             return {success:false, message: error.response.data.message };
//         }
//         return { success:false,message: error.message };
//     }
// }

// export const verifyOtp = async (email, otp) => {
//     const data = { email, otp };

//     try {
//         const result = await axios.post(`${API_BASE}/api/auth/verify-otp`, data);
//         if (result.data.valid) {
//             console.log("OTP is valid!");
//             return { valid: true };
//         } else {
//             console.log("OTP is invalid or expired.");
//             return {valid:false, error: "OTP is invalid or expired." };
//         }
//     } catch (error) {
//         if (error.response) {
//             console.log("Error response:", error.response);
//             return { valid:false,error: `Server Error: ${error.response.data.message || error.response.statusText}` };
//         } else if (error.request) {
//             console.log("Error request:", error.request);
//             return {valid:false, error: "Network error: No response from server." };
//         } else {
//             console.log("Error:", error.message);
//             return { valid:false,error: `Error: ${error.message}` };
//         }
//     }
// };

// export const login = async (Formdata,dispatch) => {
//     const data = {
//         email:Formdata.email,
//         password:Formdata.password,
//      };

//     try {
//         const result = await axios.post(`${API_BASE}/api/auth/login`, data);
//         if (result.data.token) {
//             localStorage.setItem("token", result.data.token);
//             dispatch(setUser({user:result.data.user,logedAt:Date.now()}));
//             return {success:true,token:result.data.token};
//         }
//         return { success:false,message: result.data.message };
//     } catch (error) {
//         if (error.response) {
//             return {success:false, message: error.response.data.message };
//         }
//         return { success:false,message: error.message };
//     }
// }


// export const resetPassword = async (Data,dispatch) => {
//     const data = {
//         email:Data.email,
//         password:Data.password
//     };

//     try {
//         const result = await axios.patch(`${API_BASE}/api/auth/resetpassword`, data);

//         if (result.data.token) {
//             localStorage.setItem("token", result.data.token);
//             dispatch(setUser({user:result.data.user,logedAt:Date.now()}));
//             return { success:true, token: result.data.token }; // Return the token if password reset is successful
//         } else {
//             return { error: "No token received after resetting password." ,message:'system down , try after some time'};
//         }
//     } catch (error) {
//         if (error.response) {
//             return { error: `Server Error: ${error.response.data.message || error.response.statusText}` ,message:error.response.data.message};
//         } else if (error.request) {
//             return { error: "Network error: No response from server.",message:'netowrk error :No response from server' };
//         } else {
//             return { error: `Error: ${error.message}` ,message:'error.message'};
//         }
//     }
// };