"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { sourceSans, bebasNeue, barlow } from "@/fonts";
import { getSocieties, createSession } from "@/utils/api";
import { useRouter } from "next/navigation";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface Society {
  _id: string;
  name: string;
  amenities?: string[];
}

export default function CreateSessionPage() {
  const router = useRouter();
  const [societies, setSocieties] = useState<Society[]>([]);
  const [selectedSociety, setSelectedSociety] = useState<string>("");
  const [sports, setSports] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await getSocieties();
        setSocieties(res.data);
      } catch (err) {
        console.error("Failed to fetch societies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSocieties();
  }, []);

  useEffect(() => {
    const selected = societies.find((s) => s.name === selectedSociety);
    if (selected && selected.amenities) {
      setSports(selected.amenities);
      setSelectedSport("");
    } else {
      setSports([]);
      setSelectedSport("");
    }
  }, [selectedSociety, societies]);

  const handleSubmit = async () => {
    if (!selectedSociety || !selectedSport || !slot)
      return alert("Please fill all fields");

    setSubmitting(true);
    try {
      await createSession({
        apartment: selectedSociety,
        sport: selectedSport,
        slot, // e.g. "03:00 PM"
      });
      alert("Session created successfully!");
      router.push("/admin/resident");
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Failed to create session");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p
          className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}
        >
          Loading Societies...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-6 gradient-bg flex flex-col space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-8">
        <Image src="/logo.png" alt="Logo" width={80} height={80} />
        <h1
          className={`text-3xl md:text-4xl font-bold text-gray-800 mt-4 md:mt-0 ${bebasNeue.className}`}
        >
          Create New Session
        </h1>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-xl flex flex-col space-y-6"
      >
        {/* Society Dropdown */}
        <label
          className={`text-gray-700 font-semibold ${barlow.className}`}
        >
          Society
        </label>
        <select
          value={selectedSociety}
          onChange={(e) => setSelectedSociety(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-800 font-medium"
        >
          <option value="">Select Society</option>
          {societies.map((s) => (
            <option key={s._id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Sport Dropdown */}
        <label
          className={`text-gray-700 font-semibold ${barlow.className}`}
        >
          Sport
        </label>
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-800 font-medium"
          disabled={sports.length === 0}
        >
          <option value="">
            {sports.length === 0 ? "Select society first" : "Select Sport"}
          </option>
          {sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>

        {/* Time Slot Picker */}
        <label
          className={`text-gray-700 font-semibold ${barlow.className}`}
        >
          Time Slot
        </label>
        <div className="px-4 py-3 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-400 transition">
          <TimePicker
            onChange={(value) => setSlot(value || "")}
            value={slot}
            format="hh:mm a"
            disableClock={false}
            clearIcon={null}
            className="w-full text-gray-800 font-medium"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold hover:from-green-500 hover:to-teal-600 transition shadow-lg"
          >
            {submitting ? "Creating..." : "Create Session"}
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold hover:from-gray-500 hover:to-gray-700 transition shadow-lg"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
