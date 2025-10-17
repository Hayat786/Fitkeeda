"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaFutbol,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  createBooking,
  getAllSessions,
  SessionData,
  createOrder,
} from "@/utils/api";
import { useProspectiveClient } from "@/utils/hooks/useProspectiveClients";
import { barlow, bebasNeue, sourceSans } from "@/fonts";

interface FormData {
  apartment: string;
  name: string;
  number: string;
  sport: string;
  slot: string;
}

interface DecodedToken {
  id: string;
  fullName: string;
  phone: string;
  societyName: string;
}

interface FilteredSlot {
  plan: string;
  slot: string;
  price?: number;
  months?: number; // ✅ duration
}

export default function BookingForm() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<FilteredSlot[]>([]);
  const [price, setPrice] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null); // ✅ duration badge

  const [formData, setFormData] = useState<FormData>({
    apartment: "",
    name: "",
    number: "",
    sport: "",
    slot: "",
  });

  const { submitClient, loading: savingClient } = useProspectiveClient();

  // Scroll to top when step changes
  useEffect(() => {
    if (formRef.current)
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Fetch user + sessions
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setFormData({
        apartment: decoded.societyName || "",
        name: decoded.fullName || "",
        number: decoded.phone || "",
        sport: "",
        slot: "",
      });

      getAllSessions()
        .then((res) => {
          const apartmentSessions = (res.data as SessionData[]).filter(
            (s) => s.apartment === decoded.societyName
          );
          setSessions(apartmentSessions);
        })
        .catch(console.error);
    } catch (err) {
      console.error("Failed to decode token", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update available slots based on sport
  useEffect(() => {
    if (formData.sport) {
      const filtered = sessions
        .filter((s) => s.sport === formData.sport)
        .map((s) => ({
          plan: s.plan,
          slot: s.slot,
          price: s.price,
          months: s.months, // ✅ add duration
        }));

      setFilteredSlots(filtered);
      if (!filtered.some((s) => s.slot === formData.slot)) {
        setFormData((prev) => ({ ...prev, slot: "" }));
        setDuration(null);
      }
    } else {
      setFilteredSlots([]);
      setFormData((prev) => ({ ...prev, slot: "" }));
      setDuration(null);
    }
  }, [formData.sport, sessions]);

  // Update price and duration when sport or slot changes
  useEffect(() => {
    const session = filteredSlots.find(
      (s) => s.slot === formData.slot && s.plan
    );
    setPrice(session?.price ?? null);
    setDuration(session?.months ?? null); // ✅ update badge
  }, [formData.slot, filteredSlots]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    try {
      await submitClient({
        fullName: formData.name,
        phone: formData.number,
        societyName: formData.apartment,
        extraDetails: {},
        sourceForm: "booking-form",
      });
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ User not recognized!");
        return;
      }

      const decoded = jwtDecode<{ id: string }>(token);
      if (!decoded.id) {
        alert("❌ User ID missing in token!");
        return;
      }

      if (!price) {
        alert("⚠️ Please select a valid sport and slot before proceeding.");
        return;
      }

      const orderResponse = await createOrder(price);
      const { id: orderId, amount } = orderResponse.data;

      const selectedSlot = filteredSlots.find(
        (s) => s.slot === formData.slot && s.plan
      );

      const bookingPayload = {
        residentId: decoded.id,
        name: formData.name,
        number: formData.number,
        apartment: formData.apartment,
        sport: formData.sport,
        slot: formData.slot,
        plan: selectedSlot?.plan ?? "",
        price,
        months: selectedSlot?.months ?? 0, // ✅ send months to backend
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Fit Keeda",
        description: "Session Booking Payment",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              await createBooking({
                ...bookingPayload,
                paymentStatus: "success",
              });
              alert("✅ Payment Successful! Booking confirmed.");
              router.push("/residents");
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            alert("❌ Error verifying payment");
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.number,
        },
        theme: { color: "#10B981" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong during booking");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-xl text-black animate-pulse">
          Loading booking form...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen gradient-bg flex flex-col lg:flex-row items-center justify-center p-6 gap-8 lg:gap-12">
      <button
        onClick={() => router.push("/residents")}
        className="lg:hidden absolute top-4 left-4 text-green-500 text-2xl z-10"
      >
        <FaArrowLeft />
      </button>

      {/* Left Section */}
      <motion.div
        className="flex flex-col justify-center items-center text-center lg:text-left lg:w-1/3 p-4 lg:p-6 lg:h-screen gap-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/full_logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="mx-auto"
        />
        <h1
          className={`${bebasNeue.className} text-3xl lg:text-5xl text-black mt-4`}
        >
          Book Your Spot Today!
        </h1>
        <p
          className={`${barlow.className} text-gray-700 text-base lg:text-xl mt-2`}
        >
          Stay active, stay healthy. Choose your sport, pick your slot, and get
          moving!
        </p>
        <button
          onClick={() => router.push("/residents")}
          className="hidden lg:inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          ← Back to Dashboard
        </button>
      </motion.div>

      {/* Right Section (Form) */}
      <motion.div
        ref={formRef}
        className="flex flex-col justify-between backdrop-blur-xl bg-black/5 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-black/10 lg:h-[90%] overflow-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Step Indicator */}
        <div className="flex justify-center mb-6 space-x-4">
          {[1, 2].map((s) => (
            <motion.div
              key={s}
              className={`h-3 w-12 rounded-full ${
                s <= step ? "bg-green-500" : "bg-gray-300/40"
              }`}
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.4, delay: s * 0.2 }}
            />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2
              className={`${sourceSans.className} text-3xl font-bold text-black mb-4`}
            >
              Your Details
            </h2>
            <p className="text-gray-700 mb-6">
              Fill in your basic information to proceed.
            </p>
            <div className="space-y-4">
              {[
                { name: "name", placeholder: "Full Name", icon: FaUser },
                {
                  name: "apartment",
                  placeholder: "Apartment / Society",
                  icon: FaFutbol,
                },
                { name: "number", placeholder: "Phone Number", icon: FaPhone },
              ].map((field, idx) => {
                const Icon = field.icon;
                return (
                  <div key={idx} className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full p-3 pl-10 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              disabled={savingClient}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              Next <FaArrowLeft className="rotate-180" />
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2
              className={`${sourceSans.className} text-3xl font-bold text-black mb-4`}
            >
              Booking Details
            </h2>
            <p className="text-gray-700 mb-6">
              Choose your sport and preferred time slot.
            </p>
            <div className="space-y-4">
              {/* Sport selection */}
              <div className="relative">
                <FaFutbol className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-white text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Sport</option>
                  {[...new Set(sessions.map((s) => s.sport))].map(
                    (sport, i) => (
                      <option key={i} value={sport}>
                        {sport}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Slot selection */}
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  name="slot"
                  value={formData.slot}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-white text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Slot</option>
                  {filteredSlots.map((opt, i) => (
                    <option key={i} value={opt.slot}>
                      Plan: {opt.plan} | Slot: {opt.slot} | Duration:{" "}
                      {opt.months ?? "N/A"} months
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Badge */}
              {duration !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-2 bg-green-200 text-green-900 rounded-lg text-center font-semibold"
                >
                  Valid for {duration} {duration === 1 ? "month" : "months"}
                </motion.div>
              )}

              {/* Price Display */}
              {price !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 bg-green-100 text-green-800 rounded-xl font-semibold text-center"
                >
                  Price: ₹ {price}
                </motion.div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-300 text-black rounded-xl hover:bg-gray-400 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-lg flex items-center gap-2"
              >
                <FaCheck /> Submit
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
