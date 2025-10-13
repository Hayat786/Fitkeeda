"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  getAllSessions, 
  getSocieties, 
  createBooking, 
  SessionData 
} from "@/utils/api";
import { FaUser, FaPhone, FaCalendarAlt, FaFutbol, FaArrowLeft, FaCheck, FaBuilding } from "react-icons/fa";
import { barlow, bebasNeue, sourceSans } from "@/fonts";

interface FormData {
  name: string;
  number: string;
  society: string;
  sessionId: string;
  sport: string;
  plan: string;
  slot: string;
  price: number;
  paymentStatus: "success" | "pending";
}

interface Society {
  _id: string;
  name: string;
  area: string;
}

export default function AdminSessionBooking() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionData[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    number: "",
    society: "",
    sessionId: "",
    sport: "",
    plan: "",
    slot: "",
    price: 0,
    paymentStatus: "pending",
  });

  // Fetch societies & sessions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [societiesRes, sessionsRes] = await Promise.all([
          getSocieties(),
          getAllSessions(),
        ]);
        setSocieties(societiesRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter sessions by selected society
  useEffect(() => {
    if (formData.society) {
      const filtered = sessions.filter((s) => s.apartment === formData.society);
      setFilteredSessions(filtered);
    } else {
      setFilteredSessions([]);
    }
  }, [formData.society, sessions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update price, slot, and plan when session changes
  const handleSessionChange = (sessionId: string) => {
    const selected = filteredSessions.find((s) => s._id === sessionId);
    setFormData({
      ...formData,
      sessionId,
      sport: selected?.sport || "",
      slot: selected?.slot || "",
      price: selected?.price || 0,
      plan: selected ? `${selected.months} month${selected.months > 1 ? "s" : ""}` : "",
    });
  };

  const handleSubmit = async () => {
  try {
    const selectedSession = filteredSessions.find(s => s._id === formData.sessionId);

    if (!selectedSession) {
      alert("⚠️ Please select a valid session before submitting.");
      return;
    }

    const bookingPayload = {
      residentId: "offline-admin",
      apartment: formData.society,
      name: formData.name,
      number: formData.number,
      sport: formData.sport,
      slot: formData.slot,
      plan: formData.plan,
      price: formData.price,
      months: selectedSession.months, // ✅ send duration, backend calculates expiryDate
      paymentStatus: formData.paymentStatus,
    };

    await createBooking(bookingPayload);
    alert("✅ Offline booking created successfully!");
    router.push("/admin");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to create booking");
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-xl text-black animate-pulse">Loading offline booking form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col lg:flex-row items-center justify-center p-6 gap-8 lg:gap-12">
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin")}
        className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
      >
        <FaArrowLeft className="text-gray-700" />
      </button>

      {/* Left Section */}
      <motion.div
        className="flex flex-col justify-center items-center text-center lg:w-1/3 p-4 gap-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image src="/full_logo.png" alt="Logo" width={250} height={250} className="mx-auto" />
        <h1 className={`${bebasNeue.className} text-3xl lg:text-5xl text-black mt-4`}>
          Admin Offline Booking
        </h1>
        <p className={`${barlow.className} text-gray-700 text-base lg:text-xl mt-2`}>
          Quickly record offline signups for societies and residents.
        </p>
      </motion.div>

      {/* Right Section (Step-wise Form) */}
      <motion.div
        ref={formRef}
        className="flex flex-col justify-between backdrop-blur-xl bg-black/5 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-black/10 overflow-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Step Indicator */}
        <div className="flex justify-center mb-6 space-x-4">
          {[1, 2].map((s) => (
            <motion.div
              key={s}
              className={`h-3 w-12 rounded-full ${s <= step ? "bg-green-500" : "bg-gray-300/40"}`}
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.4, delay: s * 0.2 }}
            />
          ))}
        </div>

        {/* Step 1: Resident Details */}
        {step === 1 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-black mb-4`}>
              Resident Details
            </h2>
            <div className="space-y-4">
              {/* Name */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-3 pl-10 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-3 pl-10 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Society */}
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  name="society"
                  value={formData.society}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Society</option>
                  {societies.map((soc) => (
                    <option key={soc._id} value={soc.name}>
                      {soc.name} ({soc.area})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              Next <FaArrowLeft className="rotate-180" />
            </button>
          </>
        )}

        {/* Step 2: Session & Payment */}
        {step === 2 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-black mb-4`}>
              Booking Details
            </h2>
            <div className="space-y-4">
              {/* Session */}
              <div className="relative">
                <FaFutbol className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  name="sessionId"
                  value={formData.sessionId}
                  onChange={(e) => {
                    const selected = filteredSessions.find((s) => s._id === e.target.value);
                    setFormData({
                      ...formData,
                      sessionId: e.target.value,
                      sport: selected?.sport || "",
                      slot: selected?.slot || "",
                      price: selected?.price || 0,
                      plan: selected ? `${selected.months} month${selected.months > 1 ? "s" : ""}` : "",
                    });
                  }}
                  className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Session</option>
                  {filteredSessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.sport} — {s.slot} — ₹{s.price} — {s.months} month{s.months > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Status */}
              <div className="relative">
                <FaCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Not Paid</option>
                  <option value="success">Paid</option>
                </select>
              </div>

              {/* Price Display */}
              <div className="text-right text-gray-700 font-semibold">
                Price: ₹{formData.price} — Plan: {formData.plan}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-300 text-black rounded-xl hover:bg-gray-400 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-lg flex items-center gap-2"
              >
                <FaCheck /> Create Booking
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
