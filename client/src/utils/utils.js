import { jwtDecode } from 'jwt-decode';


const getToken = () => {
    const result = localStorage.getItem("token");
    return result;
};

const getRole = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded.userrole || null;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

const extractRole = (token) => {
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch (error) {
        return null;
    }
};


 const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.user_id;
    } catch (error) {
      return null;
    }
  };

const clearAuth = () => {
    localStorage.removeItem("token");
};

export { getToken, getRole, extractRole, clearAuth,getUserId };
