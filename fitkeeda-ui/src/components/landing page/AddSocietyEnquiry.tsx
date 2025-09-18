"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { createSocietyEnquiry, SocietyEnquiry } from "@/utils/api";
import {
  FaBuilding,
  FaPhone,
  FaMapMarkerAlt,
  FaListUl,
  FaArrowLeft,
  FaCheck,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { bebasNeue, barlow } from "@/fonts";
import { useRouter } from "next/navigation";

export default function SocietyEnquiryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const steps = ["Basic Info", "Location & Amenities", "Confirm"];
  const [step, setStep] = useState(0);

  type SocietyEnquiryPayload = Omit<
    SocietyEnquiry,
    "_id" | "createdAt" | "updatedAt"
  >;

  const [form, setForm] = useState<SocietyEnquiryPayload>({
    type: "society",
    societyName: "",
    phone: "",
    location: "",
    amenities: [],
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Smooth scroll between steps
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  const addAmenity = () => {
  if (amenityInput.trim()) {
    setForm((prev) => ({
      ...prev,
      amenities: [...(prev.amenities || []), amenityInput.trim()],
    }));
    setAmenityInput("");
  }
};


  const removeAmenity = (index: number) => {
  setForm((prev) => ({
    ...prev,
    amenities: (prev.amenities || []).filter((_, i) => i !== index),
  }));
};


  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!form.societyName?.trim()) {
      alert("Please enter society name");
      return;
    }
    try {
      setLoading(true);
      await createSocietyEnquiry(form);
      alert("✅ Society enquiry submitted!");
      setForm({
        type: "society",
        societyName: "",
        phone: "",
        location: "",
        amenities: [],
      });
      setAmenityInput("");
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
      {/* Mobile Back */}
      <button
        onClick={() => router.push("/")}
        className="lg:hidden absolute top-4 left-4 text-blue-600 text-2xl z-10"
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
          Society Enquiry Form
        </h1>
        <p
          className={`${barlow.className} text-gray-700 text-base lg:text-xl mt-2`}
        >
          Submit details of your society to connect with coaches and services.
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
                i <= step ? "bg-blue-600" : "bg-gray-300/40"
              }`}
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
            />
          ))}
        </div>

        {/* Step 0: Basic Info */}
{step === 0 && (
  <div className="space-y-5">
    {/* Caption */}
    <h2 className="text-center font-bold text-xl text-black mb-4">
      Basic Info
    </h2>
    <p className="text-center text-black text-base mb-2">
      Enter your society’s basic information
    </p>

    <div className="relative">
      <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
      <input
        type="text"
        placeholder="Society Name"
        className="w-full p-3 pl-10 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-600 text-black bg-white"
        value={form.societyName}
        onChange={(e) => setForm({ ...form, societyName: e.target.value })}
      />
    </div>
    <div className="relative">
      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
      <input
        type="tel"
        placeholder="Phone"
        className="w-full p-3 pl-10 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-600 text-black bg-white"
        value={form.phone || ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
    </div>
  </div>
)}

{/* Step 1: Location & Amenities */}
{step === 1 && (
  <div className="space-y-5">
    {/* Caption */}
    <h2 className="text-center font-bold text-xl text-black mb-4">
      Location & Amenities
    </h2>
    <p className="text-center text-black text-base mb-2">
      Add location and available amenities
    </p>

    <div className="relative">
      <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
      <input
        type="text"
        placeholder="Location"
        className="w-full p-3 pl-10 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-600 text-black bg-white"
        value={form.location || ""}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
    </div>

    <div>
      <div className="flex items-center border rounded-lg p-2">
        <FaListUl className="text-black mr-2" />
        <input
          type="text"
          placeholder="Add an amenity"
          className="flex-1 p-2 outline-none text-black bg-white"
          value={amenityInput}
          onChange={(e) => setAmenityInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addAmenity();
            }
          }}
        />
        <button
          type="button"
          onClick={addAmenity}
          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
        >
          <FaPlus /> Add
        </button>
      </div>
      {/* Amenity chips */}
      <div className="flex flex-wrap gap-2 mt-3">
        {form.amenities?.map((a, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
          >
            {a}
            <button
              type="button"
              onClick={() => removeAmenity(i)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes />
            </button>
          </span>
        ))}
      </div>
    </div>
  </div>
)}

{/* Step 2: Confirm */}
{step === 2 && (
  <div>
    <h2 className="text-center font-bold text-xl text-black mb-4">Confirm Details</h2>
    <ul className="mb-6 space-y-4">
      <li className="bg-white p-4 rounded-lg border border-blue-300 shadow-sm text-black">
        <b>Society Name:</b> {form.societyName}
      </li>
      <li className="bg-white p-4 rounded-lg border border-blue-300 shadow-sm text-black">
        <b>Phone:</b> {form.phone}
      </li>
      <li className="bg-white p-4 rounded-lg border border-blue-300 shadow-sm text-black">
        <b>Location:</b> {form.location}
      </li>
      <li className="bg-white p-4 rounded-lg border border-blue-300 shadow-sm text-black">
        <b>Amenities:</b> {form.amenities?.join(", ")}
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
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
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
                  : "bg-blue-600 hover:bg-blue-700 text-white"
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
