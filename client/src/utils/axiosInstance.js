import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Request Interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — handle various errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const { response, message } = error;

//     if (!response) {
//       // No server response — network error
//       toast.error("Network error. Please check your internet connection.");
//     } else {
//       const status = response.status;

//       switch (status) {
//         case 400:
//           toast.error("Bad request. Please check your input.");
//           break;
//         case 401:
//           toast.error("Session expired. Redirecting to homepage.");
//           localStorage.removeItem("token");
//           window.location.href = "/";
//           break;
//         case 403:
//           toast.error("You don't have permission to do that.");
//           break;
//         case 404:
//           toast.error("Resource not found.");
//           break;
//         case 422:
//           toast.error("Validation failed. Please check your form.");
//           break;
//         case 500:
//           toast.error("Server error. Please try again later.");
//           break;
//         default:
//           toast.error(`Error: ${response.data?.message || "Unexpected error occurred."}`);
//           break;
//       }
//     }

//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, message, config } = error;

    if (!response) {
      toast.error("Network error. Please check your internet connection.");
    } else {
      const status = response.status;
      const requestUrl = config.url; // current request endpoint

      switch (status) {
        case 400:
          toast.error("Bad request. Please check your input.");
          break;
        case 401:
          // Check if request was to login or OTP endpoints
          if (
            requestUrl.includes("/auth/login") ||
            requestUrl.includes("/auth/verify-otp") ||
            requestUrl.includes("/auth/signup")
          ) {
            // Show returned error message from backend
            // toast.error(response.data?.message || "Invalid credentials.");
          } else {
            toast.error("Session expired. Redirecting to homepage.");
            localStorage.removeItem("token");
            window.location.href = "/";
          }
          break;
        case 403:
          toast.error("You don't have permission to do that.");
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 422:
          toast.error("Validation failed. Please check your form.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(`Error: ${response.data?.message || "Unexpected error occurred."}`);
          break;
      }
    }

    return Promise.reject(error);
  }
);


export default api;
