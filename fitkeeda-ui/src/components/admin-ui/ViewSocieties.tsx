"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSocieties } from "@/utils/api";
import { bebasNeue, sourceSans } from "@/fonts";
import { FaArrowLeft, FaMapMarkerAlt, FaBook, FaCheck } from "react-icons/fa";

interface SocietyData {
  _id?: string;
  name: string;
  area: string;
  amenities?: string[];
}

export default function SocietiesList() {
  const router = useRouter();
  const [societies, setSocieties] = useState<SocietyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getSocieties();
        if (!mounted) return;
        setSocieties(res.data || []);
      } catch (err) {
        console.error("Failed to fetch societies:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = societies.filter((society) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      society.name.toLowerCase().includes(q) ||
      society.area.toLowerCase().includes(q) ||
      (society.amenities?.join(", ").toLowerCase() || "").includes(q)
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
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={56} height={56} />
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}>
                Societies
              </h1>
              <p className={`text-sm text-gray-600 ${sourceSans.className}`}>
                All registered societies
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:w-96">
          <input
            aria-label="Search societies"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, area, or amenities..."
            className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className={`text-lg text-gray-700 ${sourceSans.className}`}>
            Loading societies...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center mt-12">
          <Image
            src="/empty-state.svg"
            alt="No societies"
            width={180}
            height={180}
            className="mx-auto"
          />
          <p className="text-gray-600 mt-6">No societies found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((society) => (
            <motion.div
              key={society._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-3">
                {/* Header with initials */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 text-gray-700 rounded-full flex items-center justify-center text-xl font-semibold"
                    style={{
                      background: "linear-gradient(135deg,#EAF2FF,#EEF7F1)",
                    }}
                  >
                    {society.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h2
                    className={`text-lg font-semibold text-gray-800 ${sourceSans.className} flex items-center gap-2`}
                  >
                    <FaBook className="text-gray-500" />
                    {society.name}
                  </h2>
                </div>

                {/* Area */}
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  {society.area}
                </p>

                {/* Amenities */}
                {society.amenities && society.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {society.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        <FaCheck className="text-green-600 w-3 h-3" />
                        {amenity}
                      </span>
                    ))}
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
