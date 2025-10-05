"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  getAllCoaches,
  CoachData,
  getTodayAttendance,
  markAttendance,
  AttendanceRecord,
} from "@/utils/api";
import { FaArrowLeft, FaDumbbell, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import { bebasNeue, sourceSans } from "@/fonts";

interface DecodedToken {
  phone: string;
  password: string;
}

export default function AttendancePage() {
  const [coachId, setCoachId] = useState<string>("");
  const [attendance, setAttendance] = useState<(AttendanceRecord & { session: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("coach_token");
        if (!token) return setLoading(false);

        const decoded = jwtDecode<DecodedToken>(token);
        const res = await getAllCoaches();
        const coaches: CoachData[] = res.data;
        const coach = coaches.find(c => c.phone.trim() === decoded.phone.trim());
        if (!coach || !coach._id) return setLoading(false);

        setCoachId(coach._id);

        const attRes = await getTodayAttendance(coach._id);
        setAttendance(attRes.data);
      } catch (err) {
        console.error("Error fetching attendance", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAttendance = async (sessionId: string, currentStatus: "present" | "absent") => {
    if (!coachId) return;
    const newStatus = currentStatus === "present" ? "absent" : "present";

    try {
      await markAttendance({ coachId, sessionId, status: newStatus });
      setAttendance(prev =>
        prev.map(a => a.sessionId === sessionId ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      console.error("Failed to update attendance", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}>
          Loading attendance...
        </p>
      </div>
    );
  }

  const assignedAttendance = attendance.filter(a => a.session);

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
              <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}>
                Mark Attendance
              </h1>
              <p className={`text-sm text-gray-600 ${sourceSans.className}`}>
                Track attendance for your sessions today
              </p>
            </div>
          </div>
        </div>
      </div>

      {assignedAttendance.length === 0 ? (
        <div className="text-center mt-20">
          <Image src="/empty-state.svg" alt="No attendance" width={200} height={200} className="mx-auto" />
          <p className="text-gray-600 text-lg mt-6">No sessions assigned for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          // inside the map() for assignedAttendance
{assignedAttendance.map((a, i) => {
  // parse session.slot to get session start time today
  const [hoursStr, minutesStr] = a.session?.slot.split(":") || ["0", "0"];
  const sessionTime = new Date();
  sessionTime.setHours(parseInt(hoursStr, 10), parseInt(minutesStr, 10), 0, 0);

  const now = new Date();
  const startWindow = new Date(sessionTime.getTime() - 10 * 60 * 1000); // 10 min before
  const endWindow = new Date(sessionTime.getTime() + 10 * 60 * 1000);   // 10 min after
  const canMark = now >= startWindow && now <= endWindow;

  return (
    <motion.div
      key={a.sessionId}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * i, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div>
        <h2 className={`text-lg font-semibold text-gray-800 ${sourceSans.className}`}>
          <FaDumbbell className="inline text-purple-500 mr-2" />
          {a.session?.sport}
        </h2>
        <p className="text-sm text-gray-700 flex items-center gap-2 mt-2">
          <FaMapMarkerAlt className="text-purple-400" />
          {a.session?.apartment}
        </p>
        <p className="text-sm text-gray-700 flex items-center gap-2 mt-1">
          <FaClock className="text-fuchsia-500" />
          {a.session?.slot}
        </p>
        <p className={`text-xs text-gray-400 mt-1 ${sourceSans.className}`}>
          Date: {new Date(a.date).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => toggleAttendance(a.sessionId, a.status)}
        disabled={!canMark} // disabled outside window
        className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-semibold transition ${
          a.status === "present" 
            ? "bg-green-500 hover:bg-green-600" 
            : "bg-red-500 hover:bg-red-600"
        } ${!canMark ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {a.status === "present" ? "Present" : "Absent"}
      </button>
      {!canMark && (
        <p className="text-xs text-gray-500 mt-1">
          Attendance can only be marked 10 minutes before or after the session start time
        </p>
      )}
    </motion.div>
  );
})}

        </div>
      )}
    </motion.div>
  );
}
