"use client";

import { motion } from "framer-motion";
import { MdSportsSoccer } from "react-icons/md";
import { FaUserTie, FaRunning } from "react-icons/fa";
import { bebasNeue, barlow, sourceSans } from "@/fonts";

const steps = [
  {
    icon: <MdSportsSoccer size={40} className="text-blue-600" />,
    title: "Choose Your Sport",
    description:
      "Pick your favorite activity from football, badminton, yoga, Zumba, and more — all within your society premises.",
  },
  {
    icon: <FaUserTie size={40} className="text-green-600" />,
    title: "Personal Coach Matching",
    description:
      "Get connected with a certified coach from your community instantly — tailored to your fitness goals and preferences.",
}
,
  {
    icon: <FaRunning size={40} className="text-orange-600" />,
    title: "Start Training",
    description:
      "Book sessions instantly and begin your fitness journey without stepping outside your residential complex.",
  },
];

export default function MissionSection() {
  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        className="text-center mb-12 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2
          className={`${bebasNeue.className} text-3xl md:text-4xl text-gray-800`}
        >
          How It Works
        </h2>
        <p
          className={`${sourceSans.className} text-gray-700 mt-3 text-base md:text-lg`}
        >
          Everything happens within your society — simple, safe, and
          community-driven. Book facilities, get an assigned certified coach,
          and start training without leaving your residential complex.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">{step.icon}</div>
            <h3
              className={`${barlow.className} text-xl font-semibold text-gray-800`}
            >
              {step.title}
            </h3>
            <p className={`${sourceSans.className} text-gray-600 mt-2`}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
