"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getSocieties, createAdminNotice } from "@/utils/api";
import { barlow, bebasNeue, sourceSans } from "@/fonts";

interface AdminEnquiryFormData {
  societyName: string;
  subject: string;
  message: string;
}

interface SocietyOption {
  _id: string;
  name: string;
}

export default function AdminEnquiryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [societies, setSocieties] = useState<SocietyOption[]>([]);
  const [formData, setFormData] = useState<AdminEnquiryFormData>({
    societyName: "",
    subject: "",
    message: "",
  });

  // Fetch societies for dropdown
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await getSocieties();
        setSocieties(res.data);
      } catch (err) {
        console.error("Failed to fetch societies", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSocieties();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.societyName || !formData.subject || !formData.message) {
      alert("❌ All fields are required");
      return;
    }

    try {
      const payload = {
        ...formData,
        type: "admin",
      };
      console.log("Payload:", payload);

      const res = await createAdminNotice(payload);
      console.log("API response:", res.data);

      alert("✅ Admin notice sent successfully!");
      router.push("/admin/resident");
    } catch (err: any) {
      console.error("Failed to send admin notice:", err.response?.data || err.message);
      alert(`❌ Failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-xl text-black animate-pulse">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen gradient-bg flex flex-col items-center justify-center p-6 gap-8">
      <button
        onClick={() => router.push("/admin/resident")}
        className="absolute top-4 left-4 text-green-500 text-2xl z-10"
      >
        <FaArrowLeft />
      </button>

      <motion.div
        ref={formRef}
        className="flex flex-col justify-between backdrop-blur-xl bg-black/5 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-black/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={`${bebasNeue.className} text-3xl text-black mb-6`}>
          Send Admin Notice
        </h1>

        {/* Society Dropdown */}
        <div className="mb-4">
          <label className={`${sourceSans.className} font-semibold text-gray-700`}>Select Society</label>
          <select
            name="societyName"
            value={formData.societyName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Select a Society --</option>
            {societies.map((soc) => (
              <option key={soc._id} value={soc.name}>
                {soc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className={`${sourceSans.className} font-semibold text-gray-700`}>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            className="w-full p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className={`${sourceSans.className} font-semibold text-gray-700`}>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Type your message..."
            rows={5}
            className="w-full p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg"
        >
          <FaCheck /> Send Notice
        </button>
      </motion.div>
    </div>
  );
}
