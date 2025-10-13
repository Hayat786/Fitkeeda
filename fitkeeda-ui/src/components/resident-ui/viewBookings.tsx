"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sourceSans, bebasNeue } from "@/fonts";
import { getAllBookings, BookingData } from "@/utils/api";
import { FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  fullName: string;
  phone: string;
  societyName: string;
}

export default function ResidentBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const decoded = jwtDecode<DecodedToken>(token);
        const res = await getAllBookings();

        // Only show bookings for this resident
        const residentBookings = res.data.filter(
          (b) => b.residentId === decoded.id && b._id
        );

        setBookings(residentBookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Helper to calculate days left for expiry
  const getDaysLeft = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gradient-bg animate-pulse">
        <p className={`text-2xl font-semibold text-gray-700 ${sourceSans.className}`}>
          Loading Your Bookings...
        </p>
      </div>
    );
  }

  // Filter out expired bookings
  const activeBookings = bookings.filter(
    (b) => b.expiryDate && getDaysLeft(b.expiryDate)! > 0
  );

  return (
    <motion.div
      className="min-h-screen p-6 gradient-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <button
            onClick={() => router.push("/residents")}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold text-gray-800 ${bebasNeue.className}`}>
          My Bookings
        </h1>
      </div>

      {/* Bookings Grid */}
      {activeBookings.length === 0 ? (
        <div className="text-center mt-20">
          <Image
            src="/empty-state.svg"
            alt="No bookings"
            width={200}
            height={200}
            className="mx-auto"
          />
          <p className="text-gray-600 text-lg mt-6">
            You have no active bookings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBookings.map((booking, index) => {
            const daysLeft = getDaysLeft(booking.expiryDate)!;
            const isNearExpiry = daysLeft <= 7;

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className={`rounded-xl p-6 shadow-lg flex flex-col justify-between border-l-4 ${
                  isNearExpiry ? "border-red-500 bg-gradient-to-r from-red-400 to-red-600" 
                  : "border-green-500 bg-gradient-to-r from-blue-400 to-indigo-600"
                } text-white`}
              >
                <div className="mb-4">
                  <h2 className={`text-2xl font-bold ${sourceSans.className}`}>{booking.name}</h2>
                  <p className={`text-sm opacity-80 ${sourceSans.className}`}>Apartment: <span className="font-semibold">{booking.apartment}</span></p>
                  <p className={`text-sm opacity-80 ${sourceSans.className}`}>Number: <span className="font-semibold">{booking.number}</span></p>
                </div>

                <div className="flex flex-col gap-2">
                  {booking.sport && <p className={`text-sm opacity-80 ${sourceSans.className}`}>Sport: <span className="font-semibold">{booking.sport}</span></p>}
                  {booking.plan && <p className={`text-sm opacity-80 ${sourceSans.className}`}>Plan: <span className="font-semibold">{booking.plan}</span></p>}
                  {booking.slot && <p className={`text-sm opacity-80 ${sourceSans.className}`}>Slot: <span className="font-semibold">{booking.slot}</span></p>}
                  {booking.price !== undefined && (
                    <p className={`text-sm opacity-80 ${sourceSans.className}`}>Price: <span className="font-semibold">₹ {booking.price}</span></p>
                  )}
                  {booking.paymentStatus && (
                    <p className={`text-sm font-semibold ${
                      booking.paymentStatus === "pending" ? "text-yellow-300" : "text-green-300"
                    } ${sourceSans.className}`}>
                      Payment: {booking.paymentStatus}
                    </p>
                  )}
                  {booking.expiryDate && (
                    <p className={`text-sm font-semibold ${
                      isNearExpiry ? "text-red-200" : "text-white"
                    } ${sourceSans.className}`}>
                      Days Left: {daysLeft} day{daysLeft > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
