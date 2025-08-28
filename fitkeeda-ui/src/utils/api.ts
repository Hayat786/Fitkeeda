import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // change to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Auth APIs
export const signup = (data: { fullName: string; phone: string; societyName: string; password: string }) =>
  api.post("/auth/signup", data);

export const login = (data: { phone: string; password: string }) =>
  api.post("/auth/login", data);

// ✅ Fetch logged-in resident
export const getMe = (token: string) =>
  api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ Society APIs
export const getSocieties = () => api.get("/societies");

export const getSocietyById = (id: string) => api.get(`/societies/${id}`);

export const createSociety = (data: { name: string; area: string; amenities?: string[] }) =>
  api.post("/societies", data);

export const updateSociety = (id: string, data: { name?: string; area?: string; amenities?: string[] }) =>
  api.put(`/societies/${id}`, data);

export const deleteSociety = (id: string) => api.delete(`/societies/${id}`);

export default api;
