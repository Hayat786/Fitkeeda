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

// ===================== Residents APIs =====================
export interface ResidentData {
  _id?: string;
  fullName: string;
  societyName: string;
  phone: string;
  password?: string; // ✅ optional for updates
  createdAt?: string;
  updatedAt?: string;
}

export const getAllResidents = () => api.get<ResidentData[]>("/residents");

export const getResidentById = (id: string) => api.get<ResidentData>(`/residents/${id}`);

export const createResident = (data: ResidentData) => api.post<ResidentData>("/residents", data);

export const updateResident = (id: string, data: Partial<ResidentData>) =>
  api.put<ResidentData>(`/residents/${id}`, data);

export const deleteResident = (id: string) => api.delete(`/residents/${id}`);


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
  password?:string;
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
  price?: number;
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
  price: number;
  slot?: string;
  paymentStatus?: string;
  createdBy?: string;
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

// ===================== Prospective Clients APIs =====================
export interface ProspectiveClientData {
  sourceForm: any;
  _id?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  societyName?: string;
  formSource?: string; // e.g., "session-booking"
  extraDetails?: any;  // flexible field for any additional form info
  createdAt?: string;
  updatedAt?: string;
}

// Create / add a prospective client
export const createProspectiveClient = (data: ProspectiveClientData) =>
  api.post<ProspectiveClientData>("/prospective", data);

// Get all prospective clients
export const getAllProspectiveClients = () =>
  api.get<ProspectiveClientData[]>("/prospective");

// Optionally, if you extend the controller later with ID routes:
export const getProspectiveClientById = (id: string) =>
  api.get<ProspectiveClientData>(`/prospective/${id}`);

export const updateProspectiveClient = (id: string, data: Partial<ProspectiveClientData>) =>
  api.put<ProspectiveClientData>(`/prospective/${id}`, data);

export const deleteProspectiveClient = (id: string) =>
  api.delete(`/prospective/${id}`);


// ===================== Customer Enquiry / Admin Notice APIs =====================

export interface CustomerEnquiryData {
  _id?: string;
  type: "customer";
  name: string;
  phone: string;
  message: string;
  societyName?: string; // ✅ added
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminNoticeData {
  _id?: string;
  type: "admin";
  subject: string;
  message: string;
  societyName?: string; // ✅ added
  createdAt?: string;
  updatedAt?: string;
}

export type CustomerEnquiryOrAdminNotice = CustomerEnquiryData | AdminNoticeData;

// 🔹 Create a customer enquiry
export const createCustomerEnquiry = (
  data: Omit<CustomerEnquiryData, "_id" | "createdAt" | "updatedAt" | "type">
) =>
  api.post<CustomerEnquiryData>("/customerenquiries", {
    ...data,
    type: "customer",
  });

// 🔹 Create an admin notice
export const createAdminNotice = (
  data: Omit<AdminNoticeData, "_id" | "createdAt" | "updatedAt" | "type">
) =>
  api.post<AdminNoticeData>("/customerenquiries", {
    ...data,
    type: "admin",
  });

// 🔹 Get all enquiries & notices
export const getAllCustomerEnquiriesAndAdminNotices = () =>
  api.get<CustomerEnquiryOrAdminNotice[]>("/customerenquiries");

// 🔹 Get one by ID
export const getCustomerEnquiryOrAdminNoticeById = (id: string) =>
  api.get<CustomerEnquiryOrAdminNotice>(`/customerenquiries/${id}`);

// 🔹 Delete
export const deleteCustomerEnquiryOrAdminNotice = (id: string) =>
  api.delete(`/customerenquiries/${id}`);

// ===================== Coach Auth APIs =====================
export interface CoachAuthData {
  phone: string;
  password: string; // hashed password will be handled by backend
}

// Register a new coach auth entry
export const registerCoachAuth = (data: CoachAuthData) =>
  api.post("/coach-auth/register", data);

// Login (optional, when you implement login for coaches)
export const loginCoach = (data: CoachAuthData) =>
  api.post("/coach-auth/login", data);

// ===================== Attendance APIs =====================



export interface AttendanceRecord {
  sessionId: string;
  coachId: string;
  status: "present" | "absent";
  date: string;
  markedAt?: string;

  // populated session object
  session: SessionData;
}

export interface MarkAttendancePayload {
  coachId: string;
  sessionId: string;
  status: "present" | "absent";
  date?: string;
}

// 🔹 Seed today's default "absent" attendance records (for a coach or globally)
export const seedTodayAttendance = (coachId?: string) =>
  api.post<{ success: boolean; seededCount: number }>("/attendance/seed/today", { coachId });

// 🔹 Mark present/absent for a session
export const markAttendance = (data: MarkAttendancePayload) =>
  api.post("/attendance/mark", data);

// 🔹 Get today's attendance for a coach
export const getTodayAttendance = (coachId: string) =>
  api.get<AttendanceRecord[]>(`/attendance/today/${coachId}`);




export const createOrder = (amount: number) =>
  api.post("/payments/create-order", { amount });


export default api;
