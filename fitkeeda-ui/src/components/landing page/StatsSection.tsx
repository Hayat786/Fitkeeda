"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { bebasNeue, barlow, sourceSans } from "@/fonts";
import { FaUsers, FaUserTie, FaCity, FaCalendarCheck } from "react-icons/fa";

const stats = [
  {
    label: "Residents Onboarded",
    value: 50,
    icon: <FaUsers />,
    description: "Actively using Fit Keeda's booking and session tracking tools.",
  },
  {
    label: "Certified Coaches",
    value: 10,
    icon: <FaUserTie />,
    description: "Professionals offering sessions in fitness, yoga, and sports.",
  },
  {
    label: "Partnered Societies",
    value: 2,
    icon: <FaCity />,
    description: "Fully integrated societies hosting daily Fit Keeda sessions.",
  },
  {
    label: "Sessions Conducted",
    value: 200,
    icon: <FaCalendarCheck />,
    description: "Group and personal training sessions completed to date.",
  },
];

export default function StatsSection() {
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`${bebasNeue.className} text-4xl md:text-5xl text-gray-800 mb-4`}
        >
          Building Healthier Communities
        </motion.h2>

        <p
          className={`${sourceSans.className} text-gray-600 max-w-2xl mx-auto mb-12`}
        >
          Fit Keeda is growing fast - empowering residents and coaches to create
          vibrant, health-focused communities across societies.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                whileHover={{ scale: 1.15 }}
                className="text-blue-600 text-5xl mb-4"
              >
                {stat.icon}
              </motion.div>

              {/* Animated Number */}
              <AnimatedNumber value={stat.value} />

              {/* Label */}
              <p
                className={`${sourceSans.className} text-gray-700 mt-3 text-lg font-semibold`}
              >
                {stat.label}
              </p>

              {/* Description */}
              <p className="text-gray-500 text-sm mt-2">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Animated Number Component */
function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = end / (duration / 16);

    const animate = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animate();
  }, [isInView, value]);

  return (
    <motion.span
      ref={ref}
      className={`${barlow.className} text-3xl md:text-4xl font-extrabold text-blue-700`}
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {count.toLocaleString()}
    </motion.span>
  );
}
