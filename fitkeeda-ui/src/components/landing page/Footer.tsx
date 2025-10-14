"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { bebasNeue, sourceSans } from "@/fonts";
import {
  FaEnvelope,
  FaUserShield,
  FaDumbbell,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-[350px] h-[350px] bg-blue-500 rounded-full blur-[180px] absolute top-0 left-0 animate-pulse"></div>
        <div className="w-[350px] h-[350px] bg-purple-500 rounded-full blur-[180px] absolute bottom-0 right-0 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-6xl mx-auto px-6 text-center z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <Image
            src="/mobile-logo.png"
            alt="FitKeeda Logo"
            width={160}
            height={50}
            className="object-contain"
            priority
          />
        </div>

        <p className={`text-gray-300 text-base ${sourceSans.className}`}>
          Building Healthier Communities.
        </p>

        {/* Contact Info */}
        <div className={`mt-8 text-gray-400 text-sm space-y-2 ${sourceSans.className}`}>
          <p className="flex items-center justify-center gap-2">
            <FaEnvelope className="text-blue-400" />
            <span className="text-white font-medium">General Support:</span>
            <a href="mailto:support@fitkeeda.com" className="hover:text-white">
              support@fitkeeda.com
            </a>
          </p>

          <p className="flex items-center justify-center gap-2">
            <FaUserShield className="text-green-400" />
            <span className="text-white font-medium">Admin / Partnership:</span>
            <a href="mailto:admin@fitkeeda.com" className="hover:text-white">
              admin@fitkeeda.com
            </a>
          </p>

          <p className="flex items-center justify-center gap-2">
            <FaDumbbell className="text-pink-400" />
            <span className="text-white font-medium">Coaching / Enquiry:</span>
            <a href="mailto:enquiry@fitkeeda.com" className="hover:text-white">
              enquiry@fitkeeda.com
            </a>
          </p>

          <p className="flex items-center justify-center gap-2 mt-2">
            <FaPhoneAlt className="text-yellow-400" />
            <a href="tel:+919876543210" className="hover:text-white">
              +91 74831 21473
            </a>
          </p>
        </div>

        {/* Quick Links */}
        <div
          className={`flex justify-center gap-10 mt-8 text-gray-400 text-sm ${sourceSans.className}`}
        >
          <a href="/enquiry/society" className="hover:text-white">
            Contact for Society
          </a>
          <a href="/enquiry/coach" className="hover:text-white">
            Contact for Coach
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} FitKeeda. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
}
