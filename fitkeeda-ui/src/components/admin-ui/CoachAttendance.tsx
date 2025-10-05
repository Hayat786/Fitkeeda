"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { getAllCoaches, getTodayAttendance, CoachData, AttendanceRecord } from "@/utils/api";
import { bebasNeue, sourceSans } from "@/fonts";

export default function AdminAttendancePage() {
  const router = useRouter();
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coachesRes = await getAllCoaches();
        const allCoaches: CoachData[] = coachesRes.data;
        setCoaches(allCoaches);

        // Fetch all attendance for each coach (all days)
        const attendanceData: Record<string, AttendanceRecord[]> = {};
        for (const coach of allCoaches) {
          const res = await getTodayAttendance(coach._id as string);
          attendanceData[coach._id as string] = res.data;
        }
        setAttendanceMap(attendanceData);
      } catch (err) {
        console.error("Error fetching admin attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}>
          Loading attendance data...
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
      {/* Header with back button and logo */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/coaches")}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
        >
          <FaArrowLeft className="text-gray-700" />
        </button>

        <Image src="/logo.png" alt="Logo" width={56} height={56} />

        <h1 className={`text-3xl font-bold text-gray-800 ${bebasNeue.className}`}>
          Attendance Records (Admin View)
        </h1>
      </div>

      {/* Attendance cards */}
      {coaches.map((coach) => (
        <div key={coach._id} className="mb-8">
          <h2 className={`text-xl font-semibold text-gray-800 mb-2 ${sourceSans.className}`}>
            {coach.name} ({coach.phone})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(attendanceMap[coach._id as string] || [])
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // newest day first
              .map((a) => (
                <motion.div
                  key={`${a.sessionId}-${a.date}`}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Sport:</span> {a.session?.sport}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Location:</span> {a.session?.apartment}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Time:</span> {a.session?.slot}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={a.status === "present" ? "text-green-600" : "text-red-600"}>
                      {a.status.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(a.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-semibold">Marked At:</span>{" "}
                    {a.markedAt ? new Date(a.markedAt).toLocaleTimeString() : "N/A"}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
