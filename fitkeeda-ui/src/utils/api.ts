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
  location: string;
  sessions?: string[]; // Optional
  sports?: string[];   // ✅ specialization
}

export const createCoach = (data: CoachData) => api.post("/coaches", data);

export const getAllCoaches = () => api.get<CoachData[]>("/coaches");

export const updateCoach = (id: string, data: Partial<CoachData>) =>
  api.put(`/coaches/${id}`, data);

// ===================== Sessions APIs =====================
export interface SessionData {
  _id?: string;
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
  paymentStatus?: string;
}

export const createBooking = (data: BookingData) => api.post("/bookings", data);

export const getAllBookings = () => api.get<BookingData[]>("/bookings");

export const updateBooking = (id: string, data: Partial<BookingData>) =>
  api.put(`/bookings/${id}`, data);

export const deleteBooking = (id: string) => api.delete(`/bookings/${id}`);

// ===================== Enquiry APIs =====================

// 🔹 Base
export interface BaseEnquiry {
  _id?: string;
  type: "coach" | "society";
  createdAt?: string;
  updatedAt?: string;
}

// 🔹 Coach Enquiry
export interface CoachEnquiry extends BaseEnquiry {
  type: "coach";
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  sportsSpecialized: string[]; // ✅ always required for coach
}

// 🔹 Society Enquiry
export interface SocietyEnquiry extends BaseEnquiry {
  type: "society";
  societyName: string;
  phone?: string;
  location?: string;
  amenities?: string[];
}

// Union
export type Enquiry = CoachEnquiry | SocietyEnquiry;

// 🔹 API calls
export const createCoachEnquiry = (
  data: Omit<CoachEnquiry, "_id" | "createdAt" | "updatedAt">
) => api.post<CoachEnquiry>("/enquiries", { ...data, type: "coach" });

export const createSocietyEnquiry = (
  data: Omit<SocietyEnquiry, "_id" | "createdAt" | "updatedAt">
) => api.post<SocietyEnquiry>("/enquiries", { ...data, type: "society" });

export const getAllEnquiries = () => api.get<Enquiry[]>("/enquiries");

export default api;
