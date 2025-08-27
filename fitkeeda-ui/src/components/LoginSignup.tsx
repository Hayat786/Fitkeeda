"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { FaUser, FaLock, FaPhone, FaBuilding } from "react-icons/fa";
import { bebasNeue, barlow, sourceSans } from "@/fonts";
import Image from "next/image";

// Properly typed variants for staggered animations
const inputVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gradient-bg">
      {/* Top Image for Mobile */}
      <motion.div
        className="lg:hidden w-full h-1/5 flex justify-center items-center py-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/full_logo.png"
          alt="Society Logo"
          width={180}
          height={60}
          className="object-contain"
        />
      </motion.div>

      {/* Left Image Section for Laptop */}
      <motion.div
        className="hidden lg:flex w-1/2 relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/full_logo.png"
          alt="Society Logo"
          fill
          className="object-contain p-10"
        />
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-full max-w-md h-[500px] perspective"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isLogin ? 0 : 180 }}
          transition={{ duration: 0.8 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side (Login) */}
          <div
            className="absolute w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col justify-center p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h2
              className={`text-3xl mb-6 text-center text-gray-800 ${bebasNeue.className}`}
            >
              Login
            </h2>
            <form className="space-y-5">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
                >
                  {i === 0 ? (
                    <FaPhone className="text-gray-400 mr-3" />
                  ) : (
                    <FaLock className="text-gray-400 mr-3" />
                  )}
                  <input
                    type={i === 0 ? "text" : "password"}
                    placeholder={i === 0 ? "Phone Number" : "Password"}
                    className={`w-full outline-none text-gray-700 ${barlow.className}`}
                  />
                </motion.div>
              ))}
              <motion.button
                variants={inputVariants}
                custom={2}
                initial="hidden"
                animate="visible"
                type="submit"
                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold shadow hover:opacity-90 transition ${sourceSans.className}`}
              >
                Login
              </motion.button>
            </form>
            <motion.p
              variants={inputVariants}
              custom={3}
              initial="hidden"
              animate="visible"
              className="text-center mt-4 text-gray-600"
            >
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold"
              >
                Sign Up
              </button>
            </motion.p>
          </div>

          {/* Back Side (Signup) */}
          <div
            className="absolute w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col justify-center p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h2
              className={`text-3xl mb-6 text-center text-gray-800 ${bebasNeue.className}`}
            >
              Sign Up
            </h2>
            <form className="space-y-5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
                >
                  {i === 0 && <FaUser className="text-gray-400 mr-3" />}
                  {i === 1 && <FaBuilding className="text-gray-400 mr-3" />}
                  {i === 2 && <FaPhone className="text-gray-400 mr-3" />}
                  {i === 3 && <FaLock className="text-gray-400 mr-3" />}
                  <input
                    type={i === 3 ? "password" : "text"}
                    placeholder={
                      i === 0
                        ? "Full Name"
                        : i === 1
                        ? "Society Name"
                        : i === 2
                        ? "Phone Number"
                        : "Password"
                    }
                    className={`w-full outline-none text-gray-700 ${barlow.className}`}
                  />
                </motion.div>
              ))}
              <motion.button
                variants={inputVariants}
                custom={4}
                initial="hidden"
                animate="visible"
                type="submit"
                className={`w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow hover:opacity-90 transition ${sourceSans.className}`}
              >
                Sign Up
              </motion.button>
            </form>
            <motion.p
              variants={inputVariants}
              custom={5}
              initial="hidden"
              animate="visible"
              className="text-center mt-4 text-gray-600"
            >
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-green-600 font-semibold"
              >
                Login
              </button>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
