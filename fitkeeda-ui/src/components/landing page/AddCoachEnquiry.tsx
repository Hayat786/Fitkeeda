"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { createCoachEnquiry, CoachEnquiry } from "@/utils/api";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaDumbbell,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import Image from "next/image";
import { bebasNeue, barlow } from "@/fonts";
import { useRouter } from "next/navigation";

export default function CoachEnquiryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  // Steps
  const steps = ["Personal Info", "Sports", "Confirm"];
  const [step, setStep] = useState(0);

  // Form state
  type CoachEnquiryPayload = Omit<
    CoachEnquiry,
    "_id" | "createdAt" | "updatedAt"
  >;

  const [form, setForm] = useState<CoachEnquiryPayload>({
    type: "coach",
    name: "",
    phone: "",
    email: "",
    location: "",
    sportsSpecialized: [],
  });

  const [newSport, setNewSport] = useState("");
  const [loading, setLoading] = useState(false);

  // Smooth scroll between steps
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  // Step navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Submit handler
  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!form.phone?.trim()) {
      alert("Please enter your phone");
      return;
    }

    try {
      setLoading(true);
      await createCoachEnquiry(form);
      alert("✅ Coach enquiry submitted!");
      // Reset
      setForm({
        type: "coach",
        name: "",
        phone: "",
        email: "",
        location: "",
        sportsSpecialized: [],
      });
      setStep(0);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen gradient-bg flex flex-col lg:flex-row items-center justify-center p-6 gap-8 lg:gap-12">
      {/* Global Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-green-600 text-2xl flex items-center gap-2 hover:text-green-700"
      >
        <FaArrowLeft /> Back to Home
      </button>

      {/* Left Branding */}
      <motion.div
        className="flex flex-col justify-center items-center text-center lg:text-left lg:w-1/3 p-4 lg:p-6 lg:h-screen gap-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/full_logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="mx-auto"
        />
        <h1
          className={`${bebasNeue.className} text-3xl lg:text-5xl text-black mt-4`}
        >
          Coach Enquiry Form
        </h1>
        <p
          className={`${barlow.className} text-gray-700 text-base lg:text-xl mt-2`}
        >
          Submit your details and specialization to connect with societies.
        </p>
      </motion.div>

      {/* Right Form */}
      <motion.div
        ref={formRef}
        className="flex flex-col justify-between backdrop-blur-xl bg-white/70 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-black/10 lg:h-[90%] overflow-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Step progress bar */}
        <div className="flex justify-center mb-6 space-x-4">
          {steps.map((s, i) => (
            <motion.div
              key={s}
              className={`h-3 w-12 rounded-full ${
                i <= step ? "bg-green-500" : "bg-gray-300/40"
              }`}
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
            />
          ))}
        </div>

        {/* Step 0: Personal Info */}
{step === 0 && (
  <div className="space-y-5">
    {/* Caption */}
    <h2 className="text-center font-bold text-xl text-black mb-4">
      Personal Info
    </h2>
    <p className="text-center text-black text-base mb-2">
      Enter your basic personal details
    </p>

    <div className="relative">
      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 pl-10 rounded-lg bg-white text-black 
                   placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-green-500 border border-gray-400"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
    </div>
    <div className="relative">
      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
      <input
        type="tel"
        placeholder="Phone"
        className="w-full p-3 pl-10 rounded-lg bg-white text-black 
                   placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-green-500 border border-gray-400"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
    </div>
    <div className="relative">
      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 pl-10 rounded-lg bg-white text-black 
                   placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-green-500 border border-gray-400"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
    </div>
    <div className="relative">
      <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
      <input
        type="text"
        placeholder="Location"
        className="w-full p-3 pl-10 rounded-lg bg-white text-black 
                   placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-green-500 border border-gray-400"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
    </div>
  </div>
)}

{/* Step 1: Sports */}
{step === 1 && (
  <div className="space-y-5">
    {/* Caption */}
    <h2 className="text-center font-bold text-xl text-black mb-4">
      Sports Specialization
    </h2>
    <p className="text-center text-black text-base mb-2">
      List the sports you specialize in
    </p>

    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Add Sport"
        className="flex-1 p-3 rounded-lg bg-white text-black 
                   placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-green-500 border border-gray-400"
        value={newSport}
        onChange={(e) => setNewSport(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        onClick={() => {
          if (newSport.trim()) {
            setForm({
              ...form,
              sportsSpecialized: [...form.sportsSpecialized, newSport.trim()],
            });
            setNewSport("");
          }
        }}
      >
        Add
      </button>
    </div>

    <ul className="mt-3 flex flex-wrap gap-2">
      {form.sportsSpecialized.map((sport, i) => (
        <li
          key={i}
          className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
        >
          <FaDumbbell className="mr-1" />
          {sport}
          <button
            className="ml-2 text-red-500 hover:text-red-700"
            onClick={() =>
              setForm({
                ...form,
                sportsSpecialized: form.sportsSpecialized.filter((_, idx) => idx !== i),
              })
            }
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  </div>
)}

{/* Step 2: Confirm */}
{step === 2 && (
  <div>
    {/* Caption */}
    <h2 className="text-center font-bold text-xl text-black mb-4">Confirm Details</h2>
    <ul className="mb-6 space-y-4">
      <li className="bg-white p-4 rounded-lg border border-green-300 shadow-sm text-black">
        <b>Name:</b> {form.name}
      </li>
      <li className="bg-white p-4 rounded-lg border border-green-300 shadow-sm text-black">
        <b>Phone:</b> {form.phone}
      </li>
      <li className="bg-white p-4 rounded-lg border border-green-300 shadow-sm text-black">
        <b>Email:</b> {form.email}
      </li>
      <li className="bg-white p-4 rounded-lg border border-green-300 shadow-sm text-black">
        <b>Location:</b> {form.location}
      </li>
      <li className="bg-white p-4 rounded-lg border border-green-300 shadow-sm text-black">
        <b>Sports:</b> {form.sportsSpecialized.join(", ")}
      </li>
    </ul>
  </div>
)}


        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <FaCheck /> {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
