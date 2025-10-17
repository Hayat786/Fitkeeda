"use client";

import { useEffect, useState } from "react";
import { getAllSessions, SessionData } from "@/utils/api";
import { motion } from "framer-motion";
import { bebasNeue, sourceSans } from "@/fonts";
import {
  FaArrowLeft,
  FaClock,
  FaUser,
  FaDumbbell,
  FaTag,
  FaMoneyBillWave,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
  fullName: string;
  phone: string;
  societyName: string;
}

export default function SessionsByUserApartment() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userApartment, setUserApartment] = useState<string>("");

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("❌ User not logged in!");
          return;
        }

        const decoded = jwtDecode<DecodedToken>(token);
        setUserApartment(decoded.societyName || "");

        const res = await getAllSessions();
        const userSessions = res.data.filter(
          (s: SessionData) => s.apartment === decoded.societyName
        );
        setSessions(userSessions);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/residents")}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
        >
          <FaArrowLeft className="text-gray-700" />
        </button>
        <Image src="/logo.png" alt="Logo" width={56} height={56} />
        <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}>
          Sessions in {userApartment}
        </h1>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center mt-20">
          <Image
            src="/empty-state.svg"
            alt="No sessions"
            width={200}
            height={200}
            className="mx-auto"
          />
          <p className="text-gray-600 text-lg mt-6">
            No sessions available in your apartment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session, index) => (
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

                {/* Plan and Price */}
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

                {/* Coach Info */}
                {session.assignedCoaches?.length ? (
                  <div className="mt-4 flex flex-col gap-2 text-gray-700 font-medium">
                    {session.assignedCoaches.map((c) => (
                      <div key={c.coach._id} className="flex items-center gap-2">
                        <FaUser className="text-gray-500" />
                        <span>
                          {c.coach.name} ({c.days.join(", ")})
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-red-600 font-semibold">
                    <FaUser className="text-red-500" /> Not Assigned
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
