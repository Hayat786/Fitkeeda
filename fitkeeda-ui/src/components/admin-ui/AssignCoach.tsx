"use client";

import { useEffect, useState } from "react";
import {
  getAllSessions,
  getAllCoaches,
  assignCoachToSession,
  SessionData,
  CoachData,
} from "@/utils/api";
import { motion } from "framer-motion";
import { bebasNeue, sourceSans } from "@/fonts";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AssignCoaches() {
  const router = useRouter();
  const [sessions, setSessions] = useState<(SessionData & { _id?: string })[]>([]);
  const [coaches, setCoaches] = useState<(CoachData & { _id?: string })[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<{ [key: string]: string }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sessionsRes = await getAllSessions();
      const coachesRes = await getAllCoaches();
      setSessions(sessionsRes.data.filter((s) => !s.assignedCoach)); // only unassigned
      setCoaches(coachesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (sessionId: string) => {
    const coachId = selectedCoach[sessionId];
    if (!coachId) return alert("Please select a coach");
    setLoadingId(sessionId);
    try {
      await assignCoachToSession(sessionId, coachId);
      alert("✅ Coach assigned successfully!");
      fetchData();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to assign coach");
    } finally {
      setLoadingId(null);
    }
  };

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
          Assign Coaches to Sessions
        </h1>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center mt-20">
          <Image src="/empty-state.svg" alt="No sessions" width={200} height={200} className="mx-auto" />
          <p className="text-gray-600 text-lg mt-6">
            All sessions have assigned coaches 🎉
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session, index) => (
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

                <select
                  className="w-full mt-4 p-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={selectedCoach[session._id || ""] || ""}
                  onChange={(e) =>
                    setSelectedCoach({ ...selectedCoach, [session._id || ""]: e.target.value })
                  }
                >
                  <option value="">Select Coach</option>
                  {coaches.map((coach) => (
                    <option key={coach._id} value={coach._id}>
                      {coach.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <button
                  className={`w-full px-4 py-3 rounded-lg font-semibold shadow-md transition flex items-center justify-center gap-2 ${
                    loadingId === session._id
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                  onClick={() => handleAssign(session._id || "")}
                  disabled={loadingId === session._id}
                >
                  {loadingId === session._id ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  ) : (
                    "Assign Coach"
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
