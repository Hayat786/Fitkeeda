"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getAllEnquiries,
  Enquiry,
  CoachEnquiry,
  SocietyEnquiry,
} from "@/utils/api";
import { bebasNeue, sourceSans } from "@/fonts";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaDumbbell,
  FaBuilding,
} from "react-icons/fa";

export default function AdminEnquiries() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"coach" | "society">("society"); // default societies

  useEffect(() => {
    let mounted = true;
    (async function fetchData() {
      try {
        const res = await getAllEnquiries();
        if (!mounted) return;
        setEnquiries(res.data || []);
      } catch (err) {
        console.error("Failed to fetch enquiries:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const coachEnquiries = enquiries.filter((e) => e.type === "coach") as CoachEnquiry[];
  const societyEnquiries = enquiries.filter((e) => e.type === "society") as SocietyEnquiry[];

  return (
    <motion.div
      className="min-h-screen p-6 gradient-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
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
            <h1
              className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}
            >
              Enquiries
            </h1>
            <p className={`text-sm text-gray-600 ${sourceSans.className}`}>
              Manage all incoming enquiries
            </p>
          </div>
        </div>
      </div>

      {/* Stats minimalistic */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className={`text-lg text-gray-700 ${sourceSans.className}`}>
            Loading enquiries...
          </p>
        </div>
      ) : (
        <>
          {/* Stats section - larger & full width */}
<div className="w-full max-w-5xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
  <div className="p-6 bg-white rounded-xl shadow-md">
    <p className="text-lg text-gray-600">Coach Enquiries</p>
    <p className="text-5xl font-extrabold text-green-600">
      {coachEnquiries.length}
    </p>
  </div>
  <div className="p-6 bg-white rounded-xl shadow-md">
    <p className="text-lg text-gray-600">Society Enquiries</p>
    <p className="text-5xl font-extrabold text-blue-600">
      {societyEnquiries.length}
    </p>
  </div>
</div>


          {/* Tab bar */}
          <div className="flex justify-center gap-12 border-b border-gray-200 mb-8 relative">
            {["society", "coach"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "coach" | "society")}
                className={`pb-2 text-lg font-medium transition ${
                  activeTab === tab
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "coach" ? "Coaches" : "Societies"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className={`h-0.5 rounded-full ${
                      tab === "coach" ? "bg-green-500" : "bg-blue-500"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Enquiries List */}
          <AnimatePresence mode="wait">
            {activeTab === "coach" && (
              <motion.div
                key="coach-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {coachEnquiries.length === 0 ? (
                  <p className="col-span-full text-center text-gray-600">
                    No coach enquiries found.
                  </p>
                ) : (
                  coachEnquiries.map((c) => (
                    <motion.div
                      key={c._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden p-5"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaUser className="text-gray-500" />
                        {c.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                        <FaPhone className="text-gray-400" /> {c.phone || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                        <FaEnvelope className="text-gray-400" /> {c.email || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                        <FaMapMarkerAlt className="text-gray-400" /> {c.location || "N/A"}
                      </p>
                      {c.sportsSpecialized.length > 0 && (
    <div className="mt-3">
      <p className="text-base font-semibold text-gray-700 mb-1 flex items-center gap-2">
        <FaDumbbell className="text-gray-500" /> Sports Specialized:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-6">
        {c.sportsSpecialized.map((sport, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="text-green-500">•</span> {sport}
          </li>
        ))}
      </ul>
    </div>
  )}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "society" && (
              <motion.div
                key="society-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {societyEnquiries.length === 0 ? (
                  <p className="col-span-full text-center text-gray-600">
                    No society enquiries found.
                  </p>
                ) : (
                  societyEnquiries.map((s) => (
                    <motion.div
                      key={s._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden p-5"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaBuilding className="text-gray-500" />
                        {s.societyName}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                        <FaPhone className="text-gray-400" /> {s.phone || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                        <FaMapMarkerAlt className="text-gray-400" /> {s.location || "N/A"}
                      </p>
                      {s.amenities && s.amenities.length > 0 && (
    <div className="mt-3">
      <p className="text-base font-semibold text-gray-700 mb-1 flex items-center gap-2">
        <FaBuilding className="text-gray-500" /> Amenities:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-6">
        {s.amenities.map((amenity, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="text-blue-500">•</span> {amenity}
          </li>
        ))}
      </ul>
    </div>
  )}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}
