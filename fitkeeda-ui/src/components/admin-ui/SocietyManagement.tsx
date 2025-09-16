"use client";

import { JSX } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaPlusCircle,
  FaBookOpen,
  FaQuestionCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { sourceSans, bebasNeue } from "@/fonts";

interface FunctionCardProps {
  icon: JSX.Element;
  title: string;
  caption: string;
  gradient: string;
  action?: () => void;
}

export default function SocietyFunctions() {
  const router = useRouter();

  const societyFunctions: FunctionCardProps[] = [
    {
      title: "Society Sessions",
      icon: <FaCalendarAlt size={28} />,
      caption: "View all sessions scheduled for societies",
      gradient: "from-blue-400 to-indigo-600",
      action: () => router.push("/admin/societies/sessions"),
    },
    {
      title: "Add Session",
      icon: <FaPlusCircle size={28} />,
      caption: "Schedule a new session for any society",
      gradient: "from-green-400 to-teal-500",
      action: () => router.push("/admin/societies/add"),
    },
    {
      title: "Registered Societies",
      icon: <FaBookOpen size={28} />,
      caption: "Browse and manage all registered societies",
      gradient: "from-purple-400 to-pink-500",
      action: () => router.push("/admin/societies/all"),
    },
    {
      title: "Queries Received",
      icon: <FaQuestionCircle size={28} />,
      caption: "Review and respond to society queries",
      gradient: "from-red-400 to-pink-600",
      action: () => router.push("/admin/society/queries"),
    },
  ];

  return (
    <motion.div
      className="p-6 min-h-screen gradient-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header with back button */}
      <div className="flex items-center mb-8 space-x-4">
        <button
          onClick={() => router.push("/admin")}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
        >
          <FaArrowLeft className="text-gray-700" />
        </button>
        <Image
          src="/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
        <h1
          className={`text-3xl font-bold text-gray-800 ${bebasNeue.className}`}
        >
          Society Management
        </h1>
      </div>

      {/* Function Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {societyFunctions.map((card, index) => (
          <FunctionCard key={index} {...card} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

interface FunctionCardWithIndexProps extends FunctionCardProps {
  index: number;
}

function FunctionCard({
  icon,
  title,
  caption,
  gradient,
  action,
  index,
}: FunctionCardWithIndexProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.6 }}
      whileHover={{
        scale: 1.05,
        rotate: 1.5,
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      }}
      onClick={action}
      className={`cursor-pointer rounded-xl p-6 flex flex-col items-start justify-start text-white bg-gradient-to-r ${gradient} shadow-lg`}
    >
      <motion.div whileHover={{ rotate: 20 }} className="mb-4">
        {icon}
      </motion.div>
      <h2 className={`text-2xl font-bold ${sourceSans.className}`}>{title}</h2>
      <motion.p className="text-sm mt-2 opacity-90">{caption}</motion.p>
    </motion.div>
  );
}
