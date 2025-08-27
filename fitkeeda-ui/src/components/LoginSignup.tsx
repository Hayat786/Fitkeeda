"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaPhone, FaBuilding } from "react-icons/fa";
import { bebasNeue, barlow, sourceSans } from "@/fonts";
import Image from "next/image";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gradient-bg">
      {/* Top Image for Mobile */}
      <div className="lg:hidden w-full h-1/5 flex justify-center items-center py-4">
        <Image
          src="/full_logo.png"
          alt="Society Logo"
          width={180}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Left Image Section for Laptop */}
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="/full_logo.png"
          alt="Society Logo"
          fill
          className="object-contain p-10"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
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
              <div className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm">
                <FaPhone className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                />
              </div>
              <div className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold shadow hover:opacity-90 transition ${sourceSans.className}`}
              >
                Login
              </button>
            </form>
            <p className="text-center mt-4 text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold"
              >
                Sign Up
              </button>
            </p>
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
              <div className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm">
                <FaUser className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                />
              </div>
              <div className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm">
                <FaBuilding className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Society Name"
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                />
              </div>
              <div className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm">
                <FaPhone className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                />
              </div>
              <div className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow hover:opacity-90 transition ${sourceSans.className}`}
              >
                Sign Up
              </button>
            </form>
            <p className="text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-green-600 font-semibold"
              >
                Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
