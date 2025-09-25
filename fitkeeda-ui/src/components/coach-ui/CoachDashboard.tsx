"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClipboardCheck,
  FaArrowLeft,
  FaWallet,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";
import { barlow, bebasNeue, sourceSans } from "@/fonts";
import { jwtDecode } from "jwt-decode";
import { getAllCoaches, CoachData } from "@/utils/api";
import Image from "next/image";
interface DecodedToken {
  phone: string;
  password: string;
}

interface Card {
  title: string;
  icon: JSX.Element;
  action: () => void;
  gradient: string;
  caption: string;
}

export default function CoachDashboard() {
  const [coachName, setCoachName] = useState<string>("Coach");
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications] = useState<number>(3);
  const router = useRouter();

  useEffect(() => {
  const fetchCoachName = async () => {
    const token = localStorage.getItem("coach_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded token:", decoded);

      const res = await getAllCoaches();
      console.log("All coaches:", res.data);

      const coaches: CoachData[] = res.data;
      const coach = coaches.find(c => c.phone.trim() === decoded.phone.trim());

      if (coach) {
        console.log("Found coach:", coach);
        setCoachName(coach.name); // name field from API
      } else {
        console.warn("Coach not found for phone:", decoded.phone);
      }

    } catch (err) {
      console.error("Failed to fetch coach details", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCoachName();
}, []);

  console.log(coachName);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stats = [
    { label: "Upcoming Sessions", value: 5, gradient: "from-blue-400 to-indigo-600" },
  ];

  const cards: Card[] = [
    {
      title: "Your Sessions",
      icon: <FaCalendarAlt size={28} />,
      action: () => router.push("/coach/sessions"),
      gradient: "from-blue-400 to-indigo-600",
      caption: "View and manage your scheduled coaching sessions",
    },
    {
      title: "Mark Attendance",
      icon: <FaClipboardCheck size={28} />,
      action: () => router.push("/coach/attendance"),
      gradient: "from-green-400 to-teal-500",
      caption: "Mark attendance for your conducted sessions",
    },
    {
      title: "Admin Notices",
      icon: <FaEnvelope size={28} />,
      action: () => router.push("/coach/notices"),
      gradient: "from-gray-400 to-gray-600",
      caption: "Read important updates from admin",
    },
    {
      title: "Payment Logs",
      icon: <FaWallet size={28} />,
      action: () => router.push("/coach/payments"),
      gradient: "from-red-400 to-pink-600",
      caption: "Check all past and pending payment records",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 animate-pulse">
        <p className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}>
          Loading Dashboard...
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
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition text-gray-800 font-semibold"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

     {/* Header */}
<motion.div className="mb-8 flex items-center justify-between">
  {/* Logo + Welcome */}
  <div className="flex items-center gap-4">
    <Image src="/logo.png" alt="Logo" width={56} height={56} />
    <div>
      <h1 className={`text-4xl md:text-5xl font-bold text-gray-800 ${bebasNeue.className}`}>
        Welcome, {coachName}!
      </h1>
      <p className={`text-xl text-gray-600 ${barlow.className}`}>
        {formattedDate}
      </p>
    </div>
  </div>

  {/* Notifications */}
  <div className="relative cursor-pointer">
    <FaBell size={28} className="text-blue-600" />
    {notifications > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {notifications}
      </span>
    )}
  </div>
</motion.div>


      {/* Quick Stats */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className={`rounded-xl p-4 text-white bg-gradient-to-r ${stat.gradient} shadow-lg flex flex-col items-center justify-center`}
          >
            <p className="text-lg font-semibold">{stat.value}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Cards Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 2, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
            onClick={card.action}
            className={`cursor-pointer rounded-xl p-6 flex flex-col items-start justify-start text-white bg-gradient-to-r ${card.gradient} shadow-lg`}
          >
            <motion.div whileHover={{ rotate: 20 }} className="mb-4">
              {card.icon}
            </motion.div>
            <h2 className={`text-2xl font-bold ${sourceSans.className}`}>{card.title}</h2>
            <motion.p
              className="text-sm mt-2 opacity-80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              {card.caption}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
