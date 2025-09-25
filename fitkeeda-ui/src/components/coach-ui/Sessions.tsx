"use client";

import { useEffect, useState } from "react";
import { getAllSessions, getAllCoaches, SessionData, CoachData } from "@/utils/api";
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
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  phone: string;
  password: string;
}

export default function CoachSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [apartments, setApartments] = useState<string[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [coachId, setCoachId] = useState<string>("");

  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    fetchCoachSessions();
  }, []);

  const fetchCoachSessions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("coach_token");
      if (!token) {
        router.push("/login"); // or wherever
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);
      // get coach _id
      const coachesRes = await getAllCoaches();
      const coaches: CoachData[] = coachesRes.data;
      const coach = coaches.find(c => c.phone.trim() === decoded.phone.trim());
      if (!coach) {
        console.warn("Coach not found");
        setLoading(false);
        return;
      }
      setCoachId(coach._id!);

      // get sessions assigned to this coach
      const sessionsRes = await getAllSessions();
      const allSessions: SessionData[] = sessionsRes.data;
      const coachSessions = allSessions.filter(
        s => s.assignedCoach?._id === coach._id
      );
      setSessions(coachSessions);

      // extract unique apartments
      const uniqueApts = [...new Set(coachSessions.map(s => s.apartment))];
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

    const coachName =
      s.assignedCoach &&
      typeof s.assignedCoach === "object" &&
      "name" in s.assignedCoach &&
      s.assignedCoach.name
        ? String((s.assignedCoach as { name?: string }).name).toLowerCase()
        : "";

    return (
      s.sport.toLowerCase().includes(q) ||
      s.apartment.toLowerCase().includes(q) ||
      s.slot.toLowerCase().includes(q) ||
      coachName.includes(q)
    );
  });

  const assignedSessions = filteredSessions.filter(
    (s) =>
      s.assignedCoach &&
      typeof s.assignedCoach === "object" &&
      "name" in s.assignedCoach
  );

  const unassignedSessions = filteredSessions.filter(
    (s) =>
      !s.assignedCoach ||
      !(typeof s.assignedCoach === "object" && "name" in s.assignedCoach)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p
          className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}
        >
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
            onClick={() => router.push("/coach")}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
            aria-label="Back"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>

          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={56} height={56} />
            <div>
              <h1
                className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}
              >
                Your Sessions
              </h1>
              <p
                className={`text-sm text-gray-600 ${sourceSans.className}`}
              >
                Browse sessions assigned to you
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

      {/* Assigned Section */}
      {assignedSessions.length > 0 ? (
        <>
          <h2
            className={`text-xl font-bold text-green-700 mb-4 ${sourceSans.className}`}
          >
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
                    <h2
                      className={`text-lg font-semibold text-gray-800 ${sourceSans.className}`}
                    >
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
                  <div className="mt-4 flex items-center gap-2 text-gray-700 font-medium">
                    <FaUser className="text-gray-500" />
                    Coach:{" "}
                    <span className="text-gray-900 font-semibold">
                      {String((session.assignedCoach as { name?: string }).name)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-20">
          <Image
            src="/empty-state.svg"
            alt="No sessions"
            width={200}
            height={200}
            className="mx-auto"
          />
          <p className="text-gray-600 text-lg mt-6">
            You have no assigned sessions.
          </p>
        </div>
      )}
    </motion.div>
  );
}
