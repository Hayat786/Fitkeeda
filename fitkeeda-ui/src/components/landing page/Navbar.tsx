"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sourceSans } from "@/fonts";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md shadow-md"
      >
        <div className="max-w-7xl mx-auto px-3 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="h-16 w-32 relative block">
            <Image
              src="/logo.png"
              alt="FitKeeda Logo"
              fill
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex gap-6 items-center text-white font-medium ${sourceSans.className}`}
          >
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              About
            </Link>
            <Link
              href="/auth-resident"
              className="hover:text-gray-300 transition-colors"
            >
              Book
            </Link>
            <Link href="/coach" className="hover:text-gray-300 transition-colors">
              Enrollment
            </Link>

            <Link
              href="/admin/login"
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
            >
              Admin Login
            </Link>
            <Link
              href="/coach/login"
              className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors shadow-md"
            >
              Coach Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div
            className="md:hidden text-white text-3xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-gray-900 text-white shadow-lg z-50 flex flex-col p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            >
              <button
                className="text-2xl mb-6 self-end"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>

              <nav className={`flex flex-col gap-6 text-lg ${sourceSans.className}`}>
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About" },
                  { href: "/auth-resident", label: "Book" },
                  { href: "/coach", label: "Enrollment" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="hover:text-gray-300 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}

                <Link
                  href="/admin/login"
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  href="/coach/login"
                  className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Coach Login
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
