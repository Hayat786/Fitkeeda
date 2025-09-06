"use client";

import { JSX } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaClipboardList, FaUsers, FaRegCalendarCheck, FaArrowLeft } from "react-icons/fa";
import { MdAssignment, MdPayment } from "react-icons/md";
import { barlow, sourceSans, bebasNeue } from "@/fonts";

interface FunctionCardProps {
  icon: JSX.Element;
  title: string;
  caption: string;
  gradient: string;
  action?: () => void;
}

export default function CoachFunctions() {
  const router = useRouter();

  const coachFunctions: FunctionCardProps[] = [
    {
      title: "Assign Coaches",
      icon: <MdAssignment size={28} />,
      caption: "Assign coaches to upcoming sessions",
      gradient: "from-blue-400 to-indigo-600",
      action: () => router.push("/admin/coaches/assign"), // ✅ Placeholder route
    },
    {
      title: "Coach Schedule",
      icon: <FaRegCalendarCheck size={28} />,
      caption: "View full schedules of coaches",
      gradient: "from-green-400 to-teal-500",
      action: () => router.push("/admin/coaches/schedule"), // ✅ Placeholder route
    },
    {
      title: "Attendance Data",
      icon: <FaClipboardList size={28} />,
      caption: "Track coaches attendance records",
      gradient: "from-yellow-400 to-orange-500",
      action: () => router.push("/admin/coaches/attendance"), // ✅ Placeholder route
    },
    {
      title: "Coach Profiles",
      icon: <FaUsers size={28} />,
      caption: "Manage all coaches' details",
      gradient: "from-purple-400 to-pink-500",
      action: () => router.push("/admin/coaches/profiles"), // ✅ Placeholder route
    },
    {
      title: "Payment Logs",
      icon: <MdPayment size={28} />,
      caption: "View coach payments",
      gradient: "from-red-400 to-pink-600",
      action: () => router.push("/admin/coaches/payments"), // ✅ Placeholder route
    },
  ];

  return (
    <motion.div
      className="p-6 min-h-screen gradient-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex items-center mb-8 space-x-4">
        <button
          onClick={() => router.push("/admin")}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
        >
          <FaArrowLeft className="text-gray-700" />
        </button>
        <Image src="/logo.png" alt="Logo" width={60} height={60} className="rounded-full" />
        <h1 className={`text-3xl font-bold text-gray-800 ${bebasNeue.className}`}>
          Coach Management
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coachFunctions.map((card, index) => (
          <FunctionCard key={index} {...card} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

interface FunctionCardWithIndexProps extends FunctionCardProps {
  index: number;
}

function FunctionCard({ icon, title, caption, gradient, action, index }: FunctionCardWithIndexProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.6 }}
      whileHover={{ scale: 1.05, rotate: 1.5, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
      onClick={action}
      className={`cursor-pointer rounded-xl p-6 flex flex-col items-start justify-start text-white bg-gradient-to-r ${gradient} shadow-lg`}
    >
      <motion.div whileHover={{ rotate: 20 }} className="mb-4">{icon}</motion.div>
      <h2 className={`text-2xl font-bold ${sourceSans.className}`}>{title}</h2>
      <motion.p className="text-sm mt-2 opacity-90">{caption}</motion.p>
    </motion.div>
  );
}
