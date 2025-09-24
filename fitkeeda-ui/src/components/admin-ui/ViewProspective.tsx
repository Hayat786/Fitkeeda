"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllProspectiveClients, ProspectiveClientData } from "@/utils/api";
import { bebasNeue, sourceSans } from "@/fonts";
import { FaArrowLeft, FaUser, FaPhone, FaBuilding } from "react-icons/fa";

export default function ProspectiveClientsList() {
  const router = useRouter();
  const [clients, setClients] = useState<ProspectiveClientData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async function fetchData() {
      try {
        const res = await getAllProspectiveClients();
        if (!mounted) return;
        setClients(res.data || []);
      } catch (err) {
        console.error("Failed to fetch prospective clients:", err);
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

  const filtered = clients.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.fullName?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.societyName?.toLowerCase().includes(q) ||
      c.sourceForm?.toLowerCase().includes(q)
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
              <h1
                className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}
              >
                Prospective Clients
              </h1>
              <p className={`text-sm text-gray-600 ${sourceSans.className}`}>
                Users who submitted interest but not yet confirmed
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:w-96">
          <input
            aria-label="Search prospective clients"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, society, or source..."
            className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className={`text-lg text-gray-700 ${sourceSans.className}`}>
            Loading prospective clients...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center mt-12">
          <Image
            src="/empty-state.svg"
            alt="No prospective clients"
            width={180}
            height={180}
            className="mx-auto"
          />
          <p className="text-gray-600 mt-6">No prospective clients found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((client) => (
            <motion.div
              key={client._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-5 flex items-start gap-4">
                {/* avatar */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold"
                  style={{
                    background: "linear-gradient(135deg,#EAF2FF,#EEF7F1)",
                  }}
                >
                  <span className="text-gray-800">{initials(client.fullName)}</span>
                </div>

                {/* info */}
                <div className="flex-1">
                  <h2
                    className={`text-lg font-semibold text-gray-800 flex items-center gap-2 ${sourceSans.className}`}
                  >
                    <FaUser className="text-gray-500" />
                    {client.fullName}
                  </h2>

                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                    <FaPhone className="text-gray-400" />
                    {client.phone}
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                    <FaBuilding className="text-gray-400" />
                    {client.societyName}
                  </p>

                  {client.sourceForm && (
                    <p className="text-xs text-gray-500 mt-2">
                      Visited {client.sourceForm}
                    </p>
                  )}

                  {client.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(client.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
