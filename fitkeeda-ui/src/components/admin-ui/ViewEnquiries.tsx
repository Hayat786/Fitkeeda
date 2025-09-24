"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getAllCustomerEnquiriesAndAdminNotices,
  deleteCustomerEnquiryOrAdminNotice,
  CustomerEnquiryData,
} from "@/utils/api";
import { bebasNeue, sourceSans } from "@/fonts";
import { FaArrowLeft, FaTrash, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

export default function AdminViewEnquiries() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<CustomerEnquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<string>("");

  const fetchEnquiries = async () => {
    try {
      const res = await getAllCustomerEnquiriesAndAdminNotices();
      const customerEnquiries = res.data.filter(
        (e): e is CustomerEnquiryData => e.type === "customer"
      );
      setEnquiries(customerEnquiries);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await deleteCustomerEnquiryOrAdminNotice(id);
      setEnquiries(enquiries.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  const initials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const filtered = enquiries.filter((e) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      e.name?.toLowerCase().includes(q) ||
      e.phone?.toLowerCase().includes(q) ||
      e.societyName?.toLowerCase().includes(q) ||
      e.message?.toLowerCase().includes(q)
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
            onClick={() => router.push("/admin/resident")}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
            aria-label="Back"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={56} height={56} />
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 ${bebasNeue.className}`}>
                Customer Enquiries
              </h1>
              <p className={`text-sm text-gray-600 ${sourceSans.className}`}>
                View all customer enquiries
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:w-96">
          <input
            aria-label="Search enquiries"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, society, or message..."
            className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>
      </div>

      {/* Loading / Empty / List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className={`text-lg text-gray-700 ${sourceSans.className}`}>Loading enquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center mt-12">
          <Image
            src="/empty-state.svg"
            alt="No enquiries"
            width={180}
            height={180}
            className="mx-auto"
          />
          <p className="text-gray-600 mt-6">No customer enquiries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((enquiry) => (
            <motion.div
              key={enquiry._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative"
            >
              <div className="p-5 flex items-start gap-4">
                {/* avatar */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold"
                  style={{
                    background: "linear-gradient(135deg,#EAF2FF,#EEF7F1)",
                  }}
                >
                  <span className="text-gray-800">{initials(enquiry.name)}</span>
                </div>

                {/* info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className={`text-lg font-semibold text-gray-800 ${sourceSans.className}`}>
                      <FaUser className="inline text-gray-500 mr-2" />
                      {enquiry.name}
                    </h2>
                    <button
                      onClick={() => enquiry._id && handleDelete(enquiry._id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Delete Enquiry"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                    <FaPhone className="text-gray-400" />
                    {enquiry.phone}
                  </p>

                  {enquiry.societyName && (
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                      <FaEnvelope className="text-gray-400" />
                      {enquiry.societyName}
                    </p>
                  )}

                  <p className="text-sm text-gray-800 mt-2">{enquiry.message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Submitted: {new Date(enquiry.createdAt || "").toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
