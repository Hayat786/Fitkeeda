"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { FaUser, FaPhone, FaCalendarAlt, FaFutbol, FaArrowLeft, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createBooking, getAllSessions, SessionData } from "@/utils/api";
import { useProspectiveClient } from "@/utils/hooks/useProspectiveClients";
import { barlow, bebasNeue, sourceSans } from "@/fonts";

interface FormData {
  apartment: string;
  name: string;
  number: string;
  sport: string;
  plan: string;
  slot: string;
}

interface DecodedToken {
  id: string;
  fullName: string;
  phone: string;
  societyName: string;
}

export default function BookingForm() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    apartment: "",
    name: "",
    number: "",
    sport: "",
    plan: "",
    slot: "",
  });

  const { submitClient, loading: savingClient, error: clientError, success: clientSuccess } = useProspectiveClient();

  // Scroll to form section when step changes (mobile fix)
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  // Fetch user data and sessions
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      setFormData({
        apartment: decoded.societyName || "",
        name: decoded.fullName || "",
        number: decoded.phone || "",
        sport: "",
        plan: "",
        slot: "",
      });

      getAllSessions()
        .then((res) => {
          const apartmentSessions = (res.data as SessionData[]).filter(
            (s) => s.apartment === decoded.societyName
          );
          setSessions(apartmentSessions);
        })
        .catch(console.error);
    } catch (err) {
      console.error("Failed to decode token", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update available slots when sport changes
  useEffect(() => {
    if (formData.sport) {
      const slots = sessions.filter((s) => s.sport === formData.sport).map((s) => s.slot);
      setFilteredSlots(slots);
      if (!slots.includes(formData.slot)) setFormData((prev) => ({ ...prev, slot: "" }));
    } else {
      setFilteredSlots([]);
      setFormData((prev) => ({ ...prev, slot: "" }));
    }
  }, [formData.sport, sessions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle step 1 -> save prospective client
  const handleNext = async () => {
    try {
      await submitClient({
        fullName: formData.name,
        phone: formData.number,
        societyName: formData.apartment,
        extraDetails: {}, // you can pass step-specific info here
        formSource: "booking-form",
      });
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ User not recognized!");
        return;
      }

      const decoded = jwtDecode<{ id: string }>(token);

      const bookingPayload = {
        ...formData,
        residentId: decoded.id,
      };

      await createBooking(bookingPayload);
      alert("✅ Booking created successfully!");
      router.push("/residents");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create booking");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-xl text-black animate-pulse">Loading booking form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen gradient-bg flex flex-col lg:flex-row items-center justify-center p-6 gap-8 lg:gap-12">
      {/* Mobile Back Button */}
      <button
        onClick={() => router.push("/residents")}
        className="lg:hidden absolute top-4 left-4 text-green-500 text-2xl z-10"
      >
        <FaArrowLeft />
      </button>

      {/* Left: Logo + Text */}
      <motion.div
        className="flex flex-col justify-center items-center text-center lg:text-left lg:w-1/3 p-4 lg:p-6 lg:h-screen gap-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image src="/full_logo.png" alt="Logo" width={250} height={250} className="mx-auto" />
        <h1 className={`${bebasNeue.className} text-3xl lg:text-5xl text-black mt-4`}>
          Book Your Spot Today!
        </h1>
        <p className={`${barlow.className} text-gray-700 text-base lg:text-xl mt-2`}>
          Stay active, stay healthy. Choose your sport, pick your slot, and get moving!
        </p>
        <button
          onClick={() => router.push("/residents")}
          className="hidden lg:inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          ← Back to Dashboard
        </button>
      </motion.div>

      {/* Right: Form */}
      <motion.div
        ref={formRef}
        className="flex flex-col justify-between backdrop-blur-xl bg-black/5 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-black/10 lg:h-[90%] overflow-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Progress Bar */}
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

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-black mb-4`}>
              Your Details
            </h2>
            <p className="text-gray-700 mb-6">Fill in your basic information to proceed.</p>
            <div className="space-y-4">
              {[ 
                { name: "name", placeholder: "Full Name", icon: FaUser },
                { name: "apartment", placeholder: "Apartment / Society", icon: FaFutbol },
                { name: "number", placeholder: "Phone Number", icon: FaPhone },
              ].map((field, idx) => {
                const Icon = field.icon;
                return (
                  <div key={idx} className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full p-3 pl-10 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              disabled={savingClient}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              Next <FaArrowLeft className="rotate-180" />
            </button>
            {/* {clientError && <p className="text-red-500 mt-2">{clientError}</p>}
            {clientSuccess && <p className="text-green-500 mt-2">Saved successfully!</p>} */}
          </>
        )}

        {/* Step 2: Booking Info */}
        {step === 2 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-black mb-4`}>
              Booking Details
            </h2>
            <p className="text-gray-700 mb-6">Choose your sport, plan, and time slot.</p>
            <div className="space-y-4">
              {[ 
                { name: "sport", placeholder: "Select Sport", icon: FaFutbol, options: sessions.map((s) => s.sport) },
                { name: "slot", placeholder: "Select Slot", icon: FaCalendarAlt, options: filteredSlots },
                { name: "plan", placeholder: "Select Plan", icon: FaCalendarAlt, options: ["Monthly", "Quarterly", "Yearly"] },
              ].map((field, idx) => {
                const Icon = field.icon;
                return (
                  <div key={idx} className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <select
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
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
                <FaCheck /> Submit
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
