import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // change to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================== Auth APIs =====================
export const signup = (data: { fullName: string; phone: string; societyName: string; password: string }) =>
  api.post("/auth/signup", data);

export const login = (data: { phone: string; password: string }) =>
  api.post("/auth/login", data);

// ===================== Society APIs =====================
export const getSocieties = () => api.get("/societies");

export const getSocietyById = (id: string) => api.get(`/societies/${id}`);

export const createSociety = (data: { name: string; area: string; amenities?: string[] }) =>
  api.post("/societies", data);

export const updateSociety = (id: string, data: { name?: string; area?: string; amenities?: string[] }) =>
  api.put(`/societies/${id}`, data);

export const deleteSociety = (id: string) => api.delete(`/societies/${id}`);

// ===================== Coaches APIs =====================
export interface CoachData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  sessions?: string[]; // Optional since default is []
}

export const createCoach = (data: CoachData) => api.post("/coaches", data);

export const getAllCoaches = () => api.get<CoachData[]>("/coaches");


// ===================== Sessions APIs =====================
export interface SessionData {
  _id?:string;
  apartment: string;
  sport: string;
  slot: string;
  assignedCoach?: null | { _id: string; name: string; email: string };
}

export const createSession = (data: SessionData) => api.post("/sessions", data);

export const getAllSessions = () => api.get<SessionData[]>("/sessions");

export const assignCoachToSession = (sessionId: string, coachId: string) =>
  api.patch(`/sessions/${sessionId}/assign-coach`, { coachId });

// ===================== Bookings APIs =====================
export interface BookingData {
  _id?: string;
  apartment: string;
  name: string;
  number: string;
  sport?: string;
  plan?: string;
  slot?: string;
  paymentStatus?: string; // optional for creation
}

export const createBooking = (data: BookingData) => api.post("/bookings", data);

export const getAllBookings = () => api.get<BookingData[]>("/bookings");

export const updateBooking = (id: string, data: Partial<BookingData>) =>
  api.put(`/bookings/${id}`, data);

export const deleteBooking = (id: string) => api.delete(`/bookings/${id}`);

export default api;
