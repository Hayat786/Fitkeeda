"use client";

import { useEffect, useState } from "react";
import { getAllSessions, SessionData } from "@/utils/api";
import { motion } from "framer-motion";
import { bebasNeue, sourceSans } from "@/fonts";
import {
  FaArrowLeft,
  FaBuilding,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaDumbbell,
  FaTag,
  FaMoneyBillWave,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SessionsByApartment() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [apartments, setApartments] = useState<string[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");

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

  const filteredSessions = sessions.filter((s) => {
    if (selectedApartment && s.apartment !== selectedApartment) return false;

    const q = searchValue.trim().toLowerCase();
    if (!q) return true;

    // Search across sport, apartment, slot, or any assigned coach
    const coachesNames =
      s.assignedCoaches?.map((c) => c.coach.name.toLowerCase()).join(",") ?? "";

    return (
      s.sport.toLowerCase().includes(q) ||
      s.apartment.toLowerCase().includes(q) ||
      s.slot.toLowerCase().includes(q) ||
      coachesNames.includes(q)
    );
  });

  const assignedSessions = filteredSessions.filter((s) => s.assignedCoaches?.length);
  const unassignedSessions = filteredSessions.filter((s) => !s.assignedCoaches?.length);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
            aria-label="Back"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>

          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={56} height={56} />
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}>
                Sessions by Apartment
              </h1>
              <p className={`text-sm text-gray-600 ${sourceSans.className}`}>
                Browse sessions grouped by apartment
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:w-96">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              aria-label="Search sessions"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by sport, apartment, coach, or slot..."
              className="w-full pl-10 p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Dropdown Filter */}
      <div className="mb-8">
        <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
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

      {/* Unassigned Sessions */}
      {unassignedSessions.length > 0 && (
        <>
          <h2 className={`text-xl font-bold text-red-600 mb-4 ${sourceSans.className}`}>
            Unassigned Sessions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {unassignedSessions.map((session, index) => (
              <motion.div
                key={session._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-lg font-semibold text-gray-800 ${sourceSans.className}`}>
                      <FaDumbbell className="inline text-purple-500 mr-2" />
                      {session.sport}
                    </h2>
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <FaClock className="text-fuchsia-500" /> {session.slot}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 flex items-center gap-2 mt-3">
                    <FaMapMarkerAlt className="text-purple-400" />
                    <span className="font-medium">{session.apartment}</span>
                  </p>

                  <div className="mt-3 text-gray-700 text-sm flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FaTag className="text-blue-500" />
                      Plan: <span className="font-semibold">{session.plan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" />
                      Price: <span className="font-semibold">₹{session.price?.toLocaleString() ?? "N/A"}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-1 text-red-600 font-semibold">
                    <FaUser className="text-red-500" />
                    <span>Not Assigned</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Assigned Sessions */}
      {assignedSessions.length > 0 && (
        <>
          <h2 className={`text-xl font-bold text-green-700 mb-4 ${sourceSans.className}`}>
            Assigned Sessions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {assignedSessions.map((session, index) => (
              <motion.div
                key={session._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-lg font-semibold text-gray-800 ${sourceSans.className}`}>
                      <FaDumbbell className="inline text-purple-500 mr-2" />
                      {session.sport}
                    </h2>
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <FaClock className="text-fuchsia-500" /> {session.slot}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 flex items-center gap-2 mt-3">
                    <FaMapMarkerAlt className="text-purple-400" />
                    <span className="font-medium">{session.apartment}</span>
                  </p>

                  <div className="mt-3 text-gray-700 text-sm flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FaTag className="text-blue-500" />
                      Plan: <span className="font-semibold">{session.plan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" />
                      Price: <span className="font-semibold">₹{session.price?.toLocaleString() ?? "N/A"}</span>
                    </div>
                  </div>

                  {/* NEW — Display multiple assigned coaches */}
                  <div className="mt-4 flex flex-col gap-2 text-gray-700 font-medium">
                    {session.assignedCoaches?.map((c) => (
                      <div key={c.coach._id} className="flex items-center gap-2">
                        <FaUser className="text-gray-500" />
                        <span>
                          {c.coach.name} ({c.days.join(", ")})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* No Results */}
      {filteredSessions.length === 0 && (
        <div className="text-center mt-20">
          <Image
            src="/empty-state.svg"
            alt="No sessions"
            width={200}
            height={200}
            className="mx-auto"
          />
          <p className="text-gray-600 text-lg mt-6">
            No sessions found for this apartment.
          </p>
        </div>
      )}
    </motion.div>
  );
}
