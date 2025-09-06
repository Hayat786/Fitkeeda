"use client";

import { motion } from "framer-motion";
import { bebasNeue, sourceSans } from "@/fonts";

export default function EnquiryForm() {
  return (
    <section className="w-full py-16 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`text-4xl mb-4 ${bebasNeue.className}`}
        >
          Got a Request? Let’s Make It Happen!
        </motion.h2>

        {/* Subheading */}
        <motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3, duration: 0.8 }}
  className={`text-lg mb-8 text-gray-300 ${sourceSans.className}`}
>
  Whether you&apos;re an <span className="text-blue-400 font-semibold">Individual</span>, a 
  <span className="text-blue-400 font-semibold"> Coach</span>, or a 
  <span className="text-blue-400 font-semibold"> Society</span> – send us your request and we&apos;ll reach out!
</motion.p>


        {/* Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg grid gap-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
          />
          <textarea
            rows={4}
            placeholder="Your Message"
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            Submit Enquiry
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
