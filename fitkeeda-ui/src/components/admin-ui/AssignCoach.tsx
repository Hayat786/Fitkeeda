"use client";

import { useEffect, useState } from "react";
import {
  getAllSessions,
  getAllCoaches,
  assignCoachesToSession,
  SessionData,
  CoachData,
} from "@/utils/api";
import { motion } from "framer-motion";
import { bebasNeue, sourceSans } from "@/fonts";
import {
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaDumbbell,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AssignCoaches() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [coachSearch, setCoachSearch] = useState<{ [sessionId: string]: string }>({});
  const [selectedAssignments, setSelectedAssignments] = useState<{
    [sessionId: string]: { [coachId: string]: string[] };
  }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, coachesRes] = await Promise.all([getAllSessions(), getAllCoaches()]);
      setSessions(sessionsRes.data);
      setCoaches(coachesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCoachSelect = (sessionId: string, coachId: string) => {
    setSelectedAssignments((prev) => ({
      ...prev,
      [sessionId]: { ...(prev[sessionId] || {}), [coachId]: prev[sessionId]?.[coachId] || [] },
    }));
  };

  const handleDayToggle = (sessionId: string, coachId: string, day: string) => {
    setSelectedAssignments((prev) => {
      const sessionAssign = prev[sessionId] || {};
      const coachDays = sessionAssign[coachId] || [];
      const newDays = coachDays.includes(day)
        ? coachDays.filter((d) => d !== day)
        : [...coachDays, day];
      return { ...prev, [sessionId]: { ...sessionAssign, [coachId]: newDays } };
    });
  };

  const handleAssign = async (sessionId: string) => {
    const sessionAssignments = selectedAssignments[sessionId];
    if (!sessionAssignments || Object.keys(sessionAssignments).length === 0)
      return alert("Please select at least one coach and day");

    const payload = {
      assignments: Object.entries(sessionAssignments).map(([coachId, days]) => ({
        coachId,
        days,
      })),
    };

    setLoadingId(sessionId);
    try {
      await assignCoachesToSession(sessionId, payload);
      alert("Coaches assigned successfully!");
      fetchData();
      setSelectedAssignments((prev) => ({ ...prev, [sessionId]: {} }));
    } catch (err) {
      console.error(err);
      alert("Failed to assign coaches");
    } finally {
      setLoadingId(null);
    }
  };

  const assignedSessions = sessions.filter(
    (s) => s.assignedCoaches?.length
  );
  const unassignedSessions = sessions.filter(
    (s) => !s.assignedCoaches?.length
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}>
          Loading Sessions...
        </p>
      </div>
    );
  }

  const renderSessionCard = (session: SessionData, index: number, showAssignButton: boolean) => {
    const filteredCoaches = coaches.filter((c) =>
      c.name.toLowerCase().includes((coachSearch[session._id!] || "").toLowerCase())
    );

    return (
      <motion.div
        key={session._id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index, duration: 0.6 }}
        whileHover={{ scale: 1.05, rotate: 1.5, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
        className="rounded-xl p-6 text-gray-900 bg-white shadow-lg flex flex-col justify-between border border-gray-200"
      >
        <div>
          <h2 className={`text-2xl font-bold ${sourceSans.className}`}>
            <FaDumbbell className="inline mr-2 text-purple-500" />
            {session.sport}
          </h2>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <FaMapMarkerAlt /> {session.apartment}
          </p>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <FaClock /> {session.slot}
          </p>

          {showAssignButton ? (
            <>
              {/* Coach Search + Dropdown */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search coaches..."
                  value={coachSearch[session._id!] || ""}
                  onChange={(e) =>
                    setCoachSearch((prev) => ({ ...prev, [session._id!]: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="max-h-40 overflow-y-auto mt-2 border rounded-lg">
                  {filteredCoaches.map((coach) => (
                    <div
                      key={coach._id}
                      onClick={() => handleCoachSelect(session._id!, coach._id!)}
                      className="cursor-pointer px-3 py-2 hover:bg-green-100 flex justify-between items-center"
                    >
                      <span>{coach.name}</span>
                      {selectedAssignments[session._id!]?.[coach._id!] && (
                        <FaUser className="text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Picker */}
              {selectedAssignments[session._id!] &&
                Object.keys(selectedAssignments[session._id!]).map((coachId) => (
                  <div key={coachId} className="mt-3 border p-3 rounded-lg bg-gray-50">
                    <p className="font-semibold flex items-center gap-1">
                      <FaUser /> {coaches.find((c) => c._id === coachId)?.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          onClick={() => handleDayToggle(session._id!, coachId, day)}
                          className={`px-2 py-1 rounded-full border flex items-center gap-1 ${
                            selectedAssignments[session._id!][coachId]?.includes(day)
                              ? "bg-green-500 text-white border-green-600"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          <FaCalendarAlt /> {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </>
          ) : (
            <div className="mt-4 text-gray-700 font-medium flex flex-col gap-2">
              {session.assignedCoaches?.map((c) => (
                <div key={c.coach._id} className="flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  <span>
                    {c.coach.name} ({c.days.join(", ")})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAssignButton && (
          <div className="mt-4">
            <button
              className={`w-full px-4 py-3 rounded-lg font-semibold shadow-md transition flex items-center justify-center gap-2 ${
                loadingId === session._id
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              onClick={() => handleAssign(session._id!)}
              disabled={loadingId === session._id}
            >
              {loadingId === session._id ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                "Assign Coaches"
              )}
            </button>
          </div>
        )}
      </motion.div>
    );
  };

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

      {/* Unassigned Sessions */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Unassigned Sessions</h2>
      {unassignedSessions.length === 0 ? (
        <p className="text-gray-600 mb-10">All sessions have assigned coaches</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {unassignedSessions.map((session, index) => renderSessionCard(session, index, true))}
        </div>
      )}

      {/* Assigned Sessions */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assigned Sessions</h2>
      {assignedSessions.length === 0 ? (
        <p className="text-gray-600">No sessions assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedSessions.map((session, index) => renderSessionCard(session, index, false))}
        </div>
      )}
    </motion.div>
  );
}
