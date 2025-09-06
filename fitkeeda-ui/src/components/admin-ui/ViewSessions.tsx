"use client";

import { useEffect, useState } from "react";
import { getAllSessions, SessionData } from "@/utils/api";
import { motion } from "framer-motion";
import { bebasNeue, sourceSans } from "@/fonts";
import { FaArrowLeft, FaBuilding } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SessionsByApartment() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [apartments, setApartments] = useState<string[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllSessions();
      setSessions(res.data);

      const uniqueApts = [...new Set(res.data.map((s) => s.apartment))];
      setApartments(uniqueApts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = selectedApartment
    ? sessions.filter((s) => s.apartment === selectedApartment)
    : sessions;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}>
          Loading Sessions...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-6 gradient-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <button
            onClick={() => router.push("/admin")}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold text-gray-800 ${bebasNeue.className}`}>
          Sessions by Apartment
        </h1>
      </div>

      {/* Dropdown Filter */}
      <div className="mb-8">
        <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
          <FaBuilding /> Select Apartment
        </label>
        <select
          className="w-full md:w-80 p-3 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          value={selectedApartment}
          onChange={(e) => setSelectedApartment(e.target.value)}
        >
          <option value="">All Apartments</option>
          {apartments.map((apt, idx) => (
            <option key={idx} value={apt}>
              {apt}
            </option>
          ))}
        </select>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="text-center mt-20">
          <Image src="/empty-state.svg" alt="No sessions" width={200} height={200} className="mx-auto" />
          <p className="text-gray-600 text-lg mt-6">
            No sessions found for this apartment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                rotate: 1.5,
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              }}
              className="rounded-xl p-6 text-gray-900 bg-white shadow-lg flex flex-col justify-between border border-gray-200"
            >
              <div>
                <h2 className={`text-2xl font-bold ${sourceSans.className}`}>{session.sport}</h2>
                <p className="text-gray-500 text-sm mt-1">Apartment: {session.apartment}</p>
                <p className="text-gray-500 text-sm mt-1">Slot: {session.slot}</p>
                <p className="text-sm mt-2">
                  Coach:{" "}
                  {session.assignedCoach && typeof session.assignedCoach === "object" && "name" in session.assignedCoach ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full font-semibold text-sm">
                      {session.assignedCoach.name}
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full font-semibold text-sm">
                      Not Assigned
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
