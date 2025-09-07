"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllCoaches, CoachData } from "@/utils/api";
import { bebasNeue, sourceSans } from "@/fonts";
import { FaArrowLeft, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";

export default function CoachesList() {
  const router = useRouter();
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async function fetchData() {
      try {
        const res = await getAllCoaches();
        if (!mounted) return;
        setCoaches(res.data || []);
      } catch (err) {
        console.error("Failed to fetch coaches:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const initials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const filtered = coaches.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <motion.div
      className="min-h-screen p-6 gradient-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
            aria-label="Back"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={56} height={56} />
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}>
                Coaches
              </h1>
              <p className={`text-sm text-gray-600 ${sourceSans.className}`}>All registered coaches</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:w-96">
          <input
            aria-label="Search coaches"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className={`text-lg text-gray-700 ${sourceSans.className}`}>Loading coaches...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center mt-12">
          <Image src="/empty-state.svg" alt="No coaches" width={180} height={180} className="mx-auto" />
          <p className="text-gray-600 mt-6">No coaches found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coach) => (
            <motion.div
              key={coach._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-5 flex items-start gap-4">
                {/* avatar */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold"
                  style={{ background: "linear-gradient(135deg,#EAF2FF,#EEF7F1)" }}
                >
                  <span className="text-gray-800">{initials(coach.name)}</span>
                </div>

                {/* info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className={`text-lg font-semibold text-gray-800 ${sourceSans.className}`}>{coach.name}</h2>
                    <span className="text-sm text-gray-500">
                      {coach.sessions ? `${coach.sessions.length} session${coach.sessions.length !== 1 ? "s" : ""}` : "0 sessions"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" /> {coach.email || <span className="text-gray-400 italic">Not provided</span>}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaPhone className="text-gray-400" /> {coach.phone || <span className="text-gray-400 italic">Not provided</span>}
                    </p>
                  </div>

                  {/* actions */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/admin/coaches/schedule`)}
                      className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 shadow-sm"
                    >
                      View Schedule
                    </button>
                    
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
