"use client";

import { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaClipboardList,
  FaRegCalendarCheck,
  FaBookOpen,
  FaMoneyCheckAlt,
  FaBell,
  FaArrowLeft,
} from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { barlow, bebasNeue, sourceSans } from "@/fonts";

interface NavCardProps {
  icon: JSX.Element;
  title: string;
  caption: string;
  gradient: string;
  action?: () => void;
}

export default function AdminDashboard() {
  const [today, setToday] = useState("");
  const router = useRouter();
  const [notifications] = useState<number>(3);

  useEffect(() => {
    const date = new Date();
    setToday(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  // Quick Stats
  const stats = [
    { label: "Bookings Today", value: "32", gradient: "from-blue-400 to-indigo-600", link: "/admin/resident/bookings" },
    { label: "Sessions Needing Coach", value: "8", gradient: "from-green-400 to-teal-500", link: "#" },
    { label: "Queries Received", value: "15", gradient: "from-purple-400 to-pink-500", link: "#" },
  ];

  // Navigation Cards
  const navCards: NavCardProps[] = [
    {
      title: "Customer Management",
      icon: <FaClipboardList size={28} />,
      caption: "Manage all bookings, inquiries, and customers",
      gradient: "from-blue-400 to-indigo-600",
      action: () => router.push("/admin/resident"),
    },
    {
      title: "Coach Management",
      icon: <MdPeople size={28} />,
      caption: "Manage coaches, schedules, and attendance",
      gradient: "from-green-400 to-teal-500",
      action: () => router.push("/admin/coaches"),
    },
    {
      title: "Payments",
      icon: <FaMoneyCheckAlt size={28} />,
      caption: "View all customer and coach transactions",
      gradient: "from-yellow-400 to-orange-500",
      action: () => router.push("#"),
    },
    {
      title: "Societies",
      icon: <FaBookOpen size={28} />,
      caption: "Manage registered societies and plans",
      gradient: "from-pink-400 to-red-500",
      action: () => router.push("/admin/societies"),
    },
    {
      title: "Add New Coach",
      icon: <MdPeople size={28} />,
      caption: "Quickly onboard a new fitness coach",
      gradient: "from-purple-400 to-pink-500",
      action: () => router.push("/admin/coaches/new"),
    },
    {
      title: "Add New Society",
      icon: <FaBookOpen size={28} />,
      caption: "Quickly register a new housing society",
      gradient: "from-indigo-400 to-blue-500",
      action: () => router.push("/admin/societies/new"),
    },
  ];

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-r from-blue-50 to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header with Back Button */}
      <motion.div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <Image src="/logo.png" alt="Logo" width={60} height={60} className="rounded-full" />
          <div>
            <h1 className={`text-4xl md:text-5xl font-bold text-gray-800 ${bebasNeue.className}`}>
              Welcome, Admin!
            </h1>
            <p className={`text-xl text-gray-600 ${barlow.className}`}>{today}</p>
          </div>
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
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => {
          const isClickable = stat.link !== "#";
          return (
            <motion.div
              key={stat.label}
              whileHover={{ scale: isClickable ? 1.05 : 1, rotate: isClickable ? 1 : 0 }}
              onClick={isClickable ? () => router.push(stat.link) : undefined}
              className={`rounded-xl p-6 text-white bg-gradient-to-r ${stat.gradient} shadow-lg flex flex-col items-center justify-center ${
                isClickable ? "cursor-pointer hover:shadow-2xl transition" : ""
              }`}
            >
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Navigation Cards */}
      <motion.div>
        <h2 className={`text-2xl font-bold mb-4 text-gray-800 ${bebasNeue.className}`}>Admin Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {navCards.map((card, index) => (
            <NavCard key={index} {...card} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Navigation Card Component
function NavCard({ icon, title, caption, gradient, action }: NavCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05, rotate: 2, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
      onClick={action}
      className={`cursor-pointer rounded-xl p-6 flex flex-col items-start justify-start text-white bg-gradient-to-r ${gradient} shadow-lg`}
    >
      <motion.div whileHover={{ rotate: 20 }} className="mb-4">
        {icon}
      </motion.div>
      <h2 className={`text-xl font-bold ${sourceSans.className}`}>{title}</h2>
      <motion.p
        className="text-sm mt-2 opacity-90"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {caption}
      </motion.p>
    </motion.div>
  );
}
