"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  FaUser,
  FaPhone,
  FaArrowLeft,
  FaCheck,
  FaEnvelope,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createCustomerEnquiry } from "@/utils/api";
import { barlow, bebasNeue, sourceSans } from "@/fonts";

interface EnquiryFormData {
  name: string;
  phone: string;
  message: string;
  societyName: string;
}

interface DecodedToken {
  id: string;
  fullName: string;
  phone: string;
  societyName: string;
}

export default function EnquiryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: "",
    phone: "",
    message: "",
    societyName: "",
  });

  // Autofill name & phone from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setFormData((prev) => ({
        ...prev,
        name: decoded.fullName || "",
        phone: decoded.phone || "",
        societyName: decoded.societyName || ""
      }));
    } catch (err) {
      console.error("Failed to decode token", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Scroll on step change
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(2);

  const handleSubmit = async () => {
  console.log("Submitting enquiry with data:", formData);

  if (!formData.message?.trim()) {
    alert("❌ Please type a message before submitting");
    return;
  }

  try {
    const payload = {
      ...formData,
      type: "customer", // explicitly set type
    };
    console.log("Payload sent to API:", payload);

    const response = await createCustomerEnquiry(payload);
    console.log("API response:", response.data);

    alert("✅ Enquiry sent successfully!");
    router.push("/residents");
  } catch (err: any) {
    console.error("Enquiry failed:", err.response?.data || err.message);
    alert(`❌ Failed to send enquiry: ${err.response?.data?.message || err.message}`);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-xl text-black animate-pulse">Loading enquiry form...</p>
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
        <Image
          src="/full_logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="mx-auto"
        />
        <h1 className={`${bebasNeue.className} text-3xl lg:text-5xl text-black mt-4`}>
          Reach Out to Admin
        </h1>
        <p className={`${barlow.className} text-gray-700 text-base lg:text-xl mt-2`}>
          Have a concern, request, or feedback? Send your enquiry directly to the
          admin team.
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
              className={`h-3 w-12 rounded-full ${
                s <= step ? "bg-green-500" : "bg-gray-300/40"
              }`}
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
            <p className="text-gray-700 mb-6">Confirm your details to proceed.</p>
            <div className="space-y-4">
              {[
                { name: "name", placeholder: "Full Name", icon: FaUser },
                { name: "phone", placeholder: "Phone Number", icon: FaPhone },
              ].map((field, idx) => {
                const Icon = field.icon;
                return (
                  <div key={idx} className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name as keyof EnquiryFormData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full p-3 pl-10 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      readOnly={field.name !== "message"} // lock auto-filled fields
                    />
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              Next <FaArrowLeft className="rotate-180" />
            </button>
          </>
        )}

        {/* Step 2: Enquiry Message */}
        {step === 2 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-black mb-4`}>
              Your Enquiry
            </h2>
            <p className="text-gray-700 mb-6">Type your message below.</p>
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows={5}
                className="w-full p-3 pl-10 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
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
