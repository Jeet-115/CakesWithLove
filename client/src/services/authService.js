import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // update if deployed

// Admin login
export const loginAdmin = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    if (res.data.token) {
      // Save token to localStorage
      localStorage.setItem("adminToken", res.data.token);
    }
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: error.message };
  }
};

// Get token from localStorage
export const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

// Logout admin
export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};
