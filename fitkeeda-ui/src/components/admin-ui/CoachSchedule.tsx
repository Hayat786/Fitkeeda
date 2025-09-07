"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllCoaches, getAllSessions, CoachData, SessionData } from "@/utils/api";
import { bebasNeue, sourceSans } from "@/fonts";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminCoachSchedule() {
  const router = useRouter();
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [expandedCoach, setExpandedCoach] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const coachesRes = await getAllCoaches();
        const sessionsRes = await getAllSessions();
        setCoaches(coachesRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}>
          Loading Coaches & Sessions...
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
          Coaches Schedule
        </h1>
      </div>

      {/* All Coaches Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Coaches</h2>
      <div className="space-y-4">
        {coaches.map((coach) => {
          const sessionsForCoach = sessions.filter((s) => coach.sessions?.includes(s._id || ""));
          return (
            <div
              key={coach._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200"
            >
              <button
                onClick={() =>
                  setExpandedCoach(expandedCoach === coach._id ? null : coach._id ?? null)
                }
                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-100 rounded-xl"
              >
                <span className={`text-lg font-semibold text-gray-800 ${sourceSans.className}`}>
                  {coach.name}
                </span>
                <span className="text-gray-500">{expandedCoach === coach._id ? "▲" : "▼"}</span>
              </button>

              <AnimatePresence>
                {expandedCoach === coach._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-4 pb-4"
                  >
                    {sessionsForCoach.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {sessionsForCoach.map((session) => (
                          <motion.div
                            key={session._id}
                            whileHover={{ scale: 1.05 }}
                            className="p-4 rounded-lg text-gray-800 shadow-md bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition"
                          >
                            <p className="text-xl font-semibold">{session.sport}</p>
                            <p className="text-gray-700">Apartment: {session.apartment}</p>
                            <p className="text-gray-600">Slot: {session.slot}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-2">No sessions assigned.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
