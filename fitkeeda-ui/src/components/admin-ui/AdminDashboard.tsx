"use client";

import { useEffect, useState, JSX } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaBell,
  FaMailBulk,
  FaClipboardList,
  FaBookOpen,
  FaPlusCircle,
} from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { barlow, bebasNeue, sourceSans } from "@/fonts";
import Image from "next/image";
import { getAllBookings, getAllSessions, getAllEnquiries } from "@/utils/api";

interface NavCardProps {
  icon: JSX.Element;
  title: string;
  caption: string;
  gradient: string;
  action?: () => void;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [today, setToday] = useState("");
  const [notifications] = useState<number>(3);
  const [stats, setStats] = useState({
    bookingsToday: 0,
    sessionsNeedingCoach: 0,
    queriesReceived: 0,
  });

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

    const fetchStats = async () => {
      try {
        const [bookingsRes, sessionsRes, enquiriesRes] = await Promise.all([
          getAllBookings(),
          getAllSessions(),
          getAllEnquiries(),
        ]);

        const todayDate = date.toISOString().split("T")[0]; // YYYY-MM-DD

        const bookingsToday = bookingsRes.data.filter(
          (b: any) => b.createdAt?.split("T")[0] === todayDate
        ).length;

        const sessionsNeedingCoach = sessionsRes.data.filter(
          (s: any) => !s.assignedCoach
        ).length;

        const queriesReceived = enquiriesRes.data.length;

        setStats({ bookingsToday, sessionsNeedingCoach, queriesReceived });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats = [
    {
      label: "Bookings Today",
      value: stats.bookingsToday,
      gradient: "from-blue-400 to-indigo-600",
      link: "/admin/resident/bookings",
    },
    {
      label: "Sessions Needing Coach",
      value: stats.sessionsNeedingCoach,
      gradient: "from-green-400 to-teal-500",
      link: "/admin/coaches/assign",
    },
    {
      label: "Queries Received",
      value: stats.queriesReceived,
      gradient: "from-purple-400 to-pink-500",
      link: "/admin/enquiries",
    },
  ];

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
      title: "Societies",
      icon: <FaBookOpen size={28} />,
      caption: "Manage registered societies and plans",
      gradient: "from-pink-400 to-red-500",
      action: () => router.push("/admin/societies"),
    },
    {
      title: "Queries",
      icon: <FaMailBulk size={28} />,
      caption: "View all society and coach queries",
      gradient: "from-yellow-400 to-orange-500",
      action: () => router.push("/admin/enquiries"),
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
    {
      title: "Add Booking",
      icon: <FaPlusCircle size={28} />,
      caption: "Manually create a new resident booking",
      gradient: "from-cyan-400 to-blue-600",
      action: () => router.push("/admin/booking"),
    },
  ];

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-r from-blue-50 to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
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
          <div>
            <h1
              className={`text-4xl md:text-5xl font-bold text-gray-800 ${bebasNeue.className}`}
            >
              Welcome, Admin!
            </h1>
            <p className={`text-xl text-gray-600 ${barlow.className}`}>
              {today}
            </p>
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
        {dashboardStats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{
              scale: stat.link !== "#" ? 1.05 : 1,
              rotate: stat.link !== "#" ? 1 : 0,
            }}
            onClick={
              stat.link !== "#" ? () => router.push(stat.link) : undefined
            }
            className={`rounded-xl p-6 text-white bg-gradient-to-r ${stat.gradient} shadow-lg flex flex-col items-center justify-center ${
              stat.link !== "#"
                ? "cursor-pointer hover:shadow-2xl transition"
                : ""
            }`}
          >
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Cards */}
      <motion.div>
        <h2
          className={`text-2xl font-bold mb-4 text-gray-800 ${bebasNeue.className}`}
        >
          Admin Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {navCards.map((card, index) => (
            <NavCard key={index} {...card} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// NavCard Component
function NavCard({ icon, title, caption, gradient, action }: NavCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{
        scale: 1.05,
        rotate: 2,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      }}
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
