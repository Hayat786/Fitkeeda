"use client";

import { motion } from "framer-motion";
import { barlow, sourceSans } from "@/fonts";
import Image from "next/image";
import { FaDumbbell, FaUserPlus, FaBuilding } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-10 md:pt-2  md:pb-0 min-h-screen">
      {/* Background Image with fade in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/landing.png"
          alt="Sports stadium"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Left Gradient Overlay */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-400/80 via-blue-700/60 to-transparent mix-blend-multiply" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 max-w-7xl mx-auto pt-16 md:pt-24 pb-12 gap-10">
        
        {/* Left Side - Logo + Tagline */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center md:items-start text-white max-w-lg"
        >
          {/* Logo */}
          <Image
            src="/landing-logo.png"
            alt="FitKeeda Logo"
            width={350}
            height={100}
            className="object-contain drop-shadow-lg mb-6 max-w-[180px] md:max-w-[300px]"
            priority
          />
          {/* Tagline */}
          <p className={`${sourceSans.className} text-base md:text-xl leading-relaxed text-gray-100 text-center md:text-left`}>
            Join us in creating a fitter, stronger, and more active lifestyle.
            Whether you&apos;re an athlete, a parent, or just starting your
            journey — this is your moment. Let’s make health a habit together!
          </p>
        </motion.div>

        {/* Right Side - Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.3, delayChildren: 1.5 },
            },
          }}
          className="flex flex-col gap-4 w-full md:w-[320px] md:items-end"
        >
          {[
            { label: "Book a Session", link: "/auth-resident", icon: <FaDumbbell className="text-xl" /> },
            { label: "Enroll as Coach", link: "/enquiry/coach", icon: <FaUserPlus className="text-xl" /> },
            { label: "Society Registration", link: "/enquiry/society", icon: <FaBuilding className="text-xl" /> },
          ].map((btn, i) => (
            <motion.a
              key={i}
              href={btn.link}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.8 }}
              className={`${barlow.className} flex items-center gap-3 px-6 py-3 bg-white/90 rounded-xl font-semibold text-gray-800 hover:bg-white hover:shadow-xl shadow-lg text-lg w-full`}
            >
              {btn.icon} {btn.label}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
