"use client";

import { motion } from "framer-motion";
import { bebasNeue, sourceSans } from "@/fonts";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-16 overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-[400px] h-[400px] bg-blue-500 rounded-full blur-[200px] absolute top-0 left-0 animate-pulse"></div>
        <div className="w-[400px] h-[400px] bg-purple-500 rounded-full blur-[200px] absolute bottom-0 right-0 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-7xl mx-auto px-6 text-center z-10"
      >
        {/* Logo & Tagline */}
        <h2 className={`text-4xl font-bold ${bebasNeue.className}`}>FitKeeda</h2>
        <p className={`mt-2 text-lg text-gray-300 ${sourceSans.className}`}>
          Building Healthier Communities.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-6">
          <a
            href="#"
            className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            aria-label="Facebook"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="#"
            className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            aria-label="Instagram"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="#"
            className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            aria-label="Twitter"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="#"
            className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={18} />
          </a>
        </div>

        {/* Footer Links */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-gray-400 text-sm ${sourceSans.className}`}
        >
          <div>
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="/gallery" className="hover:text-white">Gallery</a></li>
              <li><a href="/terms" className="hover:text-white">Terms</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Get in Touch</h4>
            <p><a href="mailto:support@fitkeeda.com" className="hover:text-white">support@fitkeeda.com</a></p>
            <p><a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a></p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} FitKeeda. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
}
