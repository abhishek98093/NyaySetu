import api from "../utils/axiosInstance";
import { setUser } from "../slices/userSlice";

// ✅ 1. Send OTP
export const sendOtp = async ({email, type}) => {
  if (!email || !type) {
    throw new Error("Email and OTP type are required.");
  }

  try {
    const response = await api.post("/auth/sendotp", { email, type });

    if (response.data && response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      throw new Error(response.data?.message || "Failed to send OTP");
    }
  } catch (error) {
    console.error("sendOtp error:", error);

    throw new Error(
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error occurred while sending OTP"
    );
  }
};



export const signup = async ({ name, email, password, cnfpassword, phoneNumber, dob }) => {
  const otpToken = localStorage.getItem("otpToken");

  if (!otpToken) {
    throw new Error("OTP verification required before signup. Please verify your email.");
  }

  try {
    const result = await api.post("/auth/signup", {
      name,
      email,
      password,
      cnfpassword,
      phoneNumber,
      dob,
      otpToken,
    });

    if (result.data.token) {
      // ✅ Save token to local storage
      localStorage.setItem("token", result.data.token);

      // ✅ Remove otpToken as it's now used
      localStorage.removeItem("otpToken");

      return result.data; // full data for mutation onSuccess
    } else {
      // ✅ Backend returned success:false without token
      throw new Error(result.data.message || "Signup failed.");
    }

  } catch (error) {
    // ✅ Axios error handling
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Signup failed. Please try again.");
    }
  }
};




// ✅ 3. Verify OTP
export const verifyOtp = async ({email, otp, type}) => {
  try {
    const response = await api.post("/auth/verify-otp", { email, otp, type });

    if (response.data && response.data.success) {
      // ✅ Save otpToken to localStorage if received
      if (response.data.otpToken) {
        localStorage.setItem("otpToken", response.data.otpToken);
        console.log(response.data.otpToken);
      }

      return {
        success: true,
        message: response.data.message || "OTP verified successfully.",
        otpToken: response.data.otpToken,
      };
    } else {
      // ❌ Throw error if backend response indicates failure
      console.log('');
      throw new Error(response.data?.message || "OTP verification failed.");
    }

  } catch (error) {
    console.error("verifyOtp error:", error); // debug log

    // ❌ Throw caught error so TanStack mutation onError can handle it
    throw new Error(
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error verifying OTP."
    );
  }
};



// ✅ 4. Login
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    const result = await api.post("/auth/login", { email, password });

    if (result.data.success && result.data.token) {
      // ✅ Save token in localStorage
      localStorage.setItem("token", result.data.token);

      return {
        success: true,
        token: result.data.token,
        user: result.data.user,
        policeDetails: result.data.policeDetails || null,
        message: result.data.message || "Login successful.",
      };
    }

    throw new Error(result.data.message || "Login failed. Try again.");
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error(
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown login error"
    );
  }
};


// ✅ 5. Reset Password
// export const resetPassword = async (formData, dispatch) => {
//   console.log(formData);

//   try {
//     const { email, password } = formData;

//     // 🔥 Retrieve otpToken from localStorage
//     const otpToken = localStorage.getItem("otpToken");

//     if (!email || !password || !verifiedOtpToken) {
//       return {
//         success: false,
//         error: "Email, password, and verified OTP token are required.",
//         message: "Incomplete data. Try verifying OTP again.",
//       };
//     }

//     // ✅ Make PATCH request with required fields
//     const result = await api.patch("/auth/resetpassword", {
//       email,
//       password,
//       verifiedOtpToken,
//     });

//     if (result.data.success && result.data.token) {
//       // ✅ Save login token after password reset
//       localStorage.setItem("token", result.data.token);

//       // ✅ Clear otpToken from localStorage after use
//       localStorage.removeItem("otpToken");

//       // ✅ Update Redux store
//       dispatch(
//         setUser({
//           user: result.data.user,
//           policeDetails: result.data.policeDetails || null,
//           logedAt: Date.now(),
//         })
//       );

//       return {
//         success: true,
//         token: result.data.token,
//         message: result.data.message || "Password reset successful.",
//       };
//     }

//     return {
//       success: false,
//       error: "No token received after resetting password.",
//       message: result.data.message || "System down, try again later.",
//     };
//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     return {
//       success: false,
//       error:
//         error.response?.data?.message ||
//         error.response?.statusText ||
//         error.message,
//       message:
//         error.response?.data?.message ||
//         "No response from server or unknown error.",
//     };
//   }
// };

export const resetPassword = async ({email,password}) => {

  const otpToken = localStorage.getItem("otpToken");

  if (!email || !password || !otpToken) {
    throw new Error("Email, password, and verified OTP token are required. Please verify OTP again.");
  }

  try {
    console.log('sending signup');
    const result = await api.patch("/auth/resetpassword", {
      email,
      password,
      otpToken,
    });

    if (result.data.success && result.data.token) {
      localStorage.setItem("token", result.data.token);
      localStorage.removeItem("otpToken");
      console.log('successfull');
      
      return {
        token: result.data.token,
        user: result.data.user,
        policeDetails: result.data.policeDetails || null,
        message: result.data.message || "Password reset successful.",
      };
    }

    // If no token received
    throw new Error(result.data.message || "Password reset failed. System down, try again later.");
  } catch (error) {
    console.error("Reset Password Error:", error);

    throw new Error(
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error during password reset."
    );
  }
};

