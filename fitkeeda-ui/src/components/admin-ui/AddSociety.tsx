"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaBuilding, FaMapMarkerAlt, FaArrowLeft, FaCheck, FaList } from "react-icons/fa";
import Image from "next/image";
import { createSociety } from "@/utils/api";
import { bebasNeue, barlow, sourceSans } from "@/fonts";

interface SocietyFormData {
  name: string;
  area: string;
  amenities: string[];
}

export default function AddSocieties() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SocietyFormData>({
    name: "",
    area: "",
    amenities: [],
  });

  const [amenityInput, setAmenityInput] = useState("");

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const isStep1Valid = formData.name.trim() && formData.area.trim();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createSociety({
        name: formData.name,
        area: formData.area,
        amenities: formData.amenities,
      });
      alert("✅ Society added successfully!");
      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add society");
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
          Add a New Society
        </h1>
        <p className={`${barlow.className} text-gray-700 text-base lg:text-xl mt-2`}>
          Fill in the details to add a new society to the system.
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

        {/* Step 1: Form Inputs */}
        {step === 1 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-gray-900 mb-4`}>
              Society Details
            </h2>
            <p className="text-gray-600 mb-6">Enter the society information.</p>
            <div className="space-y-5">
              {/* Name */}
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Society Name"
                  className="w-full p-3 pl-10 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                />
              </div>
              {/* Area */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area / Location"
                  className="w-full p-3 pl-10 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                />
              </div>
              {/* Amenities Dynamic */}
              <div>
                <label className=" mb-2 font-semibold text-gray-700 flex items-center gap-2">
                  <FaList /> Amenities
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="Enter an amenity"
                    className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    disabled={!amenityInput.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {formData.amenities.map((a, index) => (
                    <li
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {a}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
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

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <>
            <h2 className={`${sourceSans.className} text-3xl font-bold text-gray-900 mb-4`}>
              Confirm Details
            </h2>
            <p className="text-gray-600 mb-6">Please verify the details before submission.</p>
            <ul className="mb-6 space-y-4">
              <li className="bg-white p-4 rounded-lg border border-green-300 shadow-sm text-gray-900">
                <strong>Name:</strong> {formData.name}
              </li>
              <li className="bg-white p-4 rounded-lg border border-green-300 shadow-sm text-gray-900">
                <strong>Area:</strong> {formData.area}
              </li>
              <li className="bg-white p-4 rounded-lg border border-green-300 shadow-sm text-gray-900">
                <strong>Amenities:</strong>{" "}
                {formData.amenities.length > 0 ? formData.amenities.join(", ") : "None"}
              </li>
            </ul>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
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
