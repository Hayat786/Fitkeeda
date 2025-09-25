"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { FaPhone, FaLock } from "react-icons/fa";
import { bebasNeue, barlow, sourceSans } from "@/fonts";
import Image from "next/image";
import { loginCoach, CoachAuthData } from "@/utils/api";
import { useRouter } from "next/navigation";

const inputVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function CoachLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data: CoachAuthData = { phone, password };
      const res = await loginCoach(data);
      if (res?.data?.access_token) {
        localStorage.setItem("coach_token", res.data.access_token);
        alert("Login successful!");
        router.push("/coach");
      } else {
        alert("Login failed: token missing");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gradient-bg items-center justify-center px-6">
      {/* Mobile Logo */}
      <motion.div
        className="w-full flex justify-center lg:hidden py-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/full_logo.png"
          alt="Logo"
          width={160}
          height={54}
          className="object-contain"
        />
      </motion.div>

      {/* Desktop Image */}
      <motion.div
        className="hidden lg:flex w-1/2 relative h-[400px]" // height added
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/full_logo.png"
          alt="Logo"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Login Form */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className={`text-3xl mb-6 text-center text-gray-800 ${bebasNeue.className}`}>
            Coach Login
          </h2>

          <form className="space-y-5" onSubmit={handleLogin}>
            <motion.div
              custom={0}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
            >
              <FaPhone className="text-gray-400 mr-3" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full outline-none text-gray-700 ${barlow.className}`}
                required
              />
            </motion.div>

            <motion.div
              custom={1}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
            >
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full outline-none text-gray-700 ${barlow.className}`}
                required
              />
            </motion.div>

            <motion.button
              custom={2}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              type="submit"
              disabled={submitting}
              className={`w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold shadow hover:opacity-90 transition disabled:opacity-60 ${sourceSans.className}`}
            >
              {submitting ? "Logging in..." : "Login"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
