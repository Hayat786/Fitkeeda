"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { bebasNeue, sourceSans } from "@/fonts";

export default function AboutHero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center text-white overflow-hidden">
      {/* Background image */}
      <Image
        src="/landing.png"
        alt="FitKeeda Background"
        fill
        priority
        className="object-cover object-center brightness-[0.45]"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-950/40 to-black/70"></div>

      <div className="relative max-w-5xl mx-auto px-6 text-center z-10 mt-18 mb-18">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/full_logo.png"
            alt="FitKeeda Logo"
            width={240}
            height={90}
            className="object-contain"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`${bebasNeue.className} text-4xl md:text-6xl font-bold mb-6 leading-tight`}
        >
          Building Healthier Communities
        </motion.h1>

        {/* Expanded Business Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className={`${sourceSans.className} text-gray-200 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed`}
        >
          At <span className="font-semibold text-white">Fit Keeda</span>, we’re
          redefining the way people access fitness. Instead of residents
          traveling miles for a good workout or personal coaching, we bring
          certified coaches, structured programs, and community-driven fitness
          sessions right into their societies.  
          <br />
          <br />
          This not only saves time but builds stronger, healthier neighborhoods.
          From yoga to football, dance to functional training — Fit Keeda connects
          expert trainers with societies, making wellness an effortless part of
          everyday living.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-4"
        >
          <a
            href="/enquiry/coach"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Join as a Coach
          </a>
          <a
            href="/enquiry/society"
            className="px-8 py-3 bg-transparent border border-white/70 hover:bg-white/10 rounded-full text-white font-semibold transition-all duration-300"
          >
            Bring Fit Keeda to Your Society
          </a>
        </motion.div>
      </div>
    </section>
  );
}
