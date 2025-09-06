"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { FaUser, FaLock, FaPhone, FaBuilding } from "react-icons/fa";
import { bebasNeue, barlow, sourceSans } from "@/fonts";
import Image from "next/image";
import { getSocieties, signup as signupApi, login as loginApi } from "@/utils/api";
import { useRouter } from "next/navigation";

type Society = { _id: string; name: string };

const inputVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function LoginSignup() {

  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  // Login form
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [name, setName] = useState("");
  const [societyId, setSocietyId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Societies
  const [societies, setSocieties] = useState<Society[]>([]);
  const [socLoading, setSocLoading] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSocieties = async () => {
      setSocLoading(true);
      try {
        const { data } = await getSocieties();
        setSocieties(data || []);
      } catch (e) {
        console.error("Failed to load societies", e);
      } finally {
        setSocLoading(false);
      }
    };
    fetchSocieties();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await loginApi({ phone: loginPhone, password: loginPassword });
      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
        alert("Login successful");
        router.push("/residents");
      } else {
        alert("Login failed: token missing");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const societyName = societies.find((s) => s._id === societyId)?.name ?? "";
      await signupApi({
        fullName: name,
        phone,
        password,
        societyName,
      });
      alert("Signup successful! Please login.");
      setIsLogin(true);
      setLoginPhone(phone);
      setLoginPassword("");
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gradient-bg">
      {/* Mobile top image */}
      <motion.div
        className="lg:hidden w-full h-1/5 flex justify-center items-center py-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/full_logo.png"
          alt="Society Logo"
          width={160}
          height={54}
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Laptop left image */}
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
          priority
        />
      </motion.div>

      {/* Right form area */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-full max-w-md h-[520px] perspective"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isLogin ? 0 : 180 }}
          transition={{ duration: 0.8 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front: Login */}
          <div
            className="absolute w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col justify-center p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h2 className={`text-3xl mb-6 text-center text-gray-800 ${bebasNeue.className}`}>
              Login
            </h2>
            <form className="space-y-5" onSubmit={handleLogin}>
              <motion.div
                custom={0}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
              >
                <FaPhone className="text-gray-400 mr-3" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                  required
                />
              </motion.div>

              <motion.div
                custom={1}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
              >
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                  required
                />
              </motion.div>

              <motion.button
                custom={2}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                type="submit"
                disabled={submitting}
                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold shadow hover:opacity-90 transition disabled:opacity-60 ${sourceSans.className}`}
              >
                {submitting ? "Logging in..." : "Login"}
              </motion.button>
            </form>

            <motion.p
              custom={3}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="text-center mt-4 text-gray-600"
            >
              Don&apos;t have an account?{" "}
              <button onClick={() => setIsLogin(false)} className="text-blue-600 font-semibold">
                Sign Up
              </button>
            </motion.p>
          </div>

          {/* Back: Signup */}
          <div
            className="absolute w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col justify-center p-8"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <h2 className={`text-3xl mb-6 text-center text-gray-800 ${bebasNeue.className}`}>
              Sign Up
            </h2>
            <form className="space-y-5" onSubmit={handleSignup}>
              <motion.div
                custom={0}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
              >
                <FaUser className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                  required
                />
              </motion.div>

              <motion.div
                custom={1}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
              >
                <FaBuilding className="text-gray-400 mr-3 shrink-0" />
                <select
                  value={societyId}
                  onChange={(e) => setSocietyId(e.target.value)}
                  className={`w-full bg-gray-100 text-gray-700 outline-none ${barlow.className}`}
                  required
                >
                  <option value="" disabled>
                    {socLoading ? "Loading societies..." : "Select your society"}
                  </option>
                  {societies.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                custom={2}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
              >
                <FaPhone className="text-gray-400 mr-3" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                  required
                />
              </motion.div>

              <motion.div
                custom={3}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center bg-gray-100 border rounded-lg p-3 shadow-sm"
              >
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full outline-none text-gray-700 ${barlow.className}`}
                  required
                />
              </motion.div>

              <motion.button
                custom={4}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                type="submit"
                disabled={submitting}
                className={`w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow hover:opacity-90 transition disabled:opacity-60 ${sourceSans.className}`}
              >
                {submitting ? "Signing up..." : "Sign Up"}
              </motion.button>
            </form>

            <motion.p
              custom={5}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="text-center mt-4 text-gray-600"
            >
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)} className="text-green-600 font-semibold">
                Login
              </button>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
