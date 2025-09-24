"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaSwimmer,
  FaArrowLeft,
  FaWallet,
  FaUserCircle,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";
import { barlow, bebasNeue, sourceSans } from "@/fonts";
import { jwtDecode } from "jwt-decode";

interface Resident {
  id: string;
  fullName: string;
  phone: string;
  societyName: string;
}

interface DecodedToken {
  id: string;
  phone: string;
  fullName: string;
  societyName: string;
  iat?: number;
  exp?: number;
}

interface Card {
  title: string;
  icon: JSX.Element;
  action: () => void;
  gradient: string;
  caption: string;
}

export default function ResidentDashboard() {
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications] = useState<number>(5);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setResident({
        id: decoded.id,
        phone: decoded.phone,
        fullName: decoded.fullName,
        societyName: decoded.societyName,
      });
    } catch (err) {
      console.error("Failed to decode token", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stats = [
    { label: "Upcoming Bookings", value: 3, gradient: "from-blue-400 to-indigo-600" },
    { label: "Active Plans", value: 2, gradient: "from-purple-400 to-pink-500" },
    { label: "Payments Pending", value: "2500 Rs", gradient: "from-red-400 to-pink-600" },
  ];

  const cards: Card[] = [
  {
    title: "Book a Plan",
    icon: <FaCalendarAlt size={28} />,
    action: () => router.push("/residents/booking-form"),
    gradient: "from-blue-400 to-indigo-600",
    caption: "Reserve your preferred subscription quickly",
  },
  {
    title: "My Plans",
    icon: <FaClipboardList size={28} />,
    action: () => alert("Navigating to My Plans"),
    gradient: "from-purple-400 to-pink-500",
    caption: "View all your active and past subscriptions",
  },
  {
    title: "Available Plans",
    icon: <FaClipboardList size={28} />,
    action: () => alert("Navigating to Available Plans"),
    gradient: "from-teal-400 to-green-500",
    caption: "See all monthly, quarterly, half-year, and yearly options",
  },
  {
    title: "Payments",
    icon: <FaWallet size={28} />,
    action: () => alert("Navigating to Payments"),
    gradient: "from-red-400 to-pink-600",
    caption: "Check pending or completed payment logs",
  },
  {
    title: "Enquiries",
    icon: <FaEnvelope size={28} />,
    action: () => router.push("/residents/enquiry"), 
    gradient: "from-yellow-400 to-orange-500",
    caption: "Send your queries directly to business managers",
  },
  {
    title: "Admin Notices",
    icon: <FaEnvelope size={28} />,
    action: () => router.push("/residents/notice"), 
    gradient: "from-gray-400 to-gray-600",
    caption: "View all notices shared by your admin",
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

      {/* Header with notifications */}
      <motion.div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-800 ${bebasNeue.className}`}>
            Welcome, {resident?.fullName}!
          </h1>
          <p className={`text-xl text-gray-600 ${barlow.className}`}>
            Society: <span className="font-semibold">{resident?.societyName}</span> | {formattedDate}
          </p>
        </div>
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
