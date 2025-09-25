"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaCheck,
  FaMapMarkerAlt,
  FaLock,
} from "react-icons/fa";
import Image from "next/image";
import { createCoach, CoachData, registerCoachAuth } from "@/utils/api";
import { bebasNeue, barlow, sourceSans } from "@/fonts";

export default function AddCoachForm() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CoachData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    sports: [],
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [sportInput, setSportInput] = useState<string>("");

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSport = () => {
    if (sportInput.trim()) {
      setFormData({
        ...formData,
        sports: [...(formData.sports || []), sportInput.trim()],
      });
      setSportInput("");
    }
  };

  const handleRemoveSport = (index: number) => {
    setFormData({
      ...formData,
      sports: (formData.sports || []).filter((_, i) => i !== index),
    });
  };

  const isStep1Valid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.location.trim();

  const isStep2Valid =
    (formData.password || "").trim() && formData.password === confirmPassword;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create the coach entry
      await createCoach(formData);

      // 2️⃣ Register coach auth (phone + password)
      await registerCoachAuth({
        phone: formData.phone,
        password: formData.password as string,
      });

      alert("✅ Coach added successfully!");
      router.push("/admin/coaches");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add coach");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen gradient-bg flex flex-col lg:flex-row items-center justify-center p-6 gap-8 lg:gap-12">
      {/* Mobile Back Button */}
      <button
        onClick={() => router.push("/admin")}
        className="lg:hidden absolute top-4 left-4 text-green-500 text-2xl z-10"
      >
        <FaArrowLeft />
      </button>

      {/* Left Branding */}
      <motion.div
        className="flex flex-col justify-center items-center text-center lg:text-left lg:w-1/3 p-4 lg:p-6 lg:h-screen gap-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image src="/full_logo.png" alt="Logo" width={250} height={250} className="mx-auto" />
        <h1 className={`${bebasNeue.className} text-3xl lg:text-5xl text-black mt-4`}>
          Add a New Coach
        </h1>
        <p className={`${barlow.className} text-gray-700 text-base lg:text-xl mt-2`}>
          Fill in coach details to add them to the system.
        </p>
        <button
          onClick={() => router.push("/admin")}
          className="hidden lg:inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          ← Back to Dashboard
        </button>
      </motion.div>

      {/* Right Form */}
      <motion.div
        ref={formRef}
        className="flex flex-col justify-between backdrop-blur-xl bg-white/70 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-black/10 lg:h-[90%] overflow-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Progress Bar */}
        <div className="flex justify-center mb-6 space-x-4">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`h-3 w-12 rounded-full ${s <= step ? "bg-green-500" : "bg-gray-300/40"}`}
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.4, delay: s * 0.2 }}
            />
          ))}
        </div>

        {/* Step 1: Coach Details */}
        {step === 1 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-gray-900 mb-4`}>
              Coach Details
            </h2>
            <p className="text-gray-600 mb-6">Enter the coach&apos;s personal information.</p>

            <div className="space-y-5">
              {/* Name + Phone */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full p-3 pl-10 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                  />
                </div>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full p-3 pl-10 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-3 pl-10 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location (e.g., Bengaluru)"
                  className="w-full p-3 pl-10 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                />
              </div>

              {/* Sports */}
              <div>
                <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
                  Sports Specialization
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sportInput}
                    onChange={(e) => setSportInput(e.target.value)}
                    placeholder="Enter a sport (e.g., Tennis)"
                    className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddSport}
                    disabled={!sportInput.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {(formData.sports || []).map((sport, index) => (
                    <li
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {sport}
                      <button
                        type="button"
                        onClick={() => handleRemoveSport(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                isStep1Valid
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next <FaArrowLeft className="rotate-180" />
            </button>
          </>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-gray-900 mb-4`}>
              Set Password
            </h2>
            <p className="text-gray-600 mb-6">Enter and confirm a password for this coach.</p>

            <div className="space-y-5">
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-3 pl-10 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full p-3 pl-10 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                />
              </div>
              {(formData.password || "") &&
                confirmPassword &&
                formData.password !== confirmPassword && (
                  <p className="text-red-500 text-sm">Passwords do not match!</p>
                )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className={`px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 ${
                  !isStep2Valid
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Next <FaArrowLeft className="rotate-180" />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-gray-900 mb-4`}>
              Review Coach Details
            </h2>
            <p className="text-gray-600 mb-6">Verify all details before submitting.</p>

            <div className="space-y-4 text-gray-900">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phone}
              </p>
              <p>
                <strong>Location:</strong> {formData.location}
              </p>
              <p>
                <strong>Sports:</strong>{" "}
                {(formData.sports || []).length > 0
                  ? (formData.sports as string[]).join(", ")
                  : "None"}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
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
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
