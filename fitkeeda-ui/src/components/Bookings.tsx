"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sourceSans, bebasNeue } from "@/fonts";
import { getAllBookings, BookingData, deleteBooking } from "@/utils/api";
import { FaArrowLeft } from "react-icons/fa";

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAllBookings();
        const validBookings = res.data.filter((b) => b._id);
        setBookings(validBookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleEdit = (id: string) => {
    console.log("Edit booking:", id);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting booking:", id);
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Failed to delete booking:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}>
          Loading Bookings...
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
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <button
            onClick={() => router.push("/admin/resident")}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold text-gray-800 ${bebasNeue.className}`}>
          Bookings Dashboard
        </h1>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 1.5, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
            className="rounded-xl p-6 text-white bg-gradient-to-r from-blue-400 to-indigo-600 shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className={`text-2xl font-bold ${sourceSans.className}`}>{booking.name}</h2>
              <p className={`text-sm mt-1 opacity-80 ${sourceSans.className}`}>Apartment: {booking.apartment}</p>
              <p className={`text-sm mt-1 opacity-80 ${sourceSans.className}`}>Number: {booking.number}</p>
              {booking.sport && <p className={`text-sm mt-1 opacity-80 ${sourceSans.className}`}>Sport: {booking.sport}</p>}
              {booking.plan && <p className={`text-sm mt-1 opacity-80 ${sourceSans.className}`}>Plan: {booking.plan}</p>}
              {booking.slot && <p className={`text-sm mt-1 opacity-80 ${sourceSans.className}`}>Slot: {booking.slot}</p>}
              {booking.paymentStatus && (
                <p
                  className={`text-sm mt-2 font-semibold ${
                    booking.paymentStatus === "pending" ? "text-yellow-300" : "text-green-300"
                  } ${sourceSans.className}`}
                >
                  Payment: {booking.paymentStatus}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleEdit(booking._id)}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold hover:from-green-500 hover:to-teal-600 transition shadow-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(booking._id)}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:from-red-600 hover:to-pink-600 transition shadow-md"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
