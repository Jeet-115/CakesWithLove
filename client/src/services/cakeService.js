import axios from "axios";
import { getAdminToken } from "./authService";

const API_URL = "http://localhost:5000/api/cakes"; // update if deployed

// -------- Public APIs --------

// Fetch all cakes
export const fetchAllCakes = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Fetch all categories
export const fetchCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data;
};

// Fetch cakes by category
export const fetchCakesByCategory = async (category) => {
  const res = await axios.get(`${API_URL}/category/${category}`);
  return res.data;
};

// -------- Admin APIs (protected) --------

const getAuthHeaders = () => {
  const token = getAdminToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Add new cake
export const addCake = async (cakeData) => {
  // cakeData should be FormData if including image
  const res = await axios.post(API_URL, cakeData, getAuthHeaders());
  return res.data;
};

// Update cake
export const updateCake = async (id, cakeData) => {
  const res = await axios.put(`${API_URL}/${id}`, cakeData, getAuthHeaders());
  return res.data;
};

// Soft delete cake
export const deleteCake = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};
