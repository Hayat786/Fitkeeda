"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaArrowLeft,
    FaCheck,
    FaMapMarkerAlt,
    FaLock,
} from "react-icons/fa";
import Image from "next/image";
import {
    createDietician,
    registerDieticianAuth,
} from "@/utils/api";
import { bebasNeue, barlow, sourceSans } from "@/fonts";

/* 🔹 Local interface (do NOT reuse CoachData) */
interface DieticianData {
    name: string;
    email: string;
    phone: string;
    location: string;
    specialization: string[];
    password?: string;
}

export default function AddDieticianForm() {
    const router = useRouter();
    const formRef = useRef<HTMLDivElement>(null);

    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<DieticianData>({
        name: "",
        email: "",
        phone: "",
        location: "",
        specialization: [],
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [specializationInput, setSpecializationInput] = useState<string>("");

    useEffect(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [step]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSpecialization = () => {
        if (!specializationInput.trim()) return;
        setFormData({
            ...formData,
            specialization: [...formData.specialization, specializationInput.trim()],
        });
        setSpecializationInput("");
    };

    const handleRemoveSpecialization = (index: number) => {
        setFormData({
            ...formData,
            specialization: formData.specialization.filter((_, i) => i !== index),
        });
    };

    const isStep1Valid =
        formData.name &&
        formData.email &&
        formData.phone &&
        formData.location;

    const isStep2Valid =
        formData.password && formData.password === confirmPassword;

    const handleSubmit = async () => {
        try {
            setLoading(true);

            /* 1️⃣ Create dietician */
            await createDietician({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                specialization: formData.specialization,
            });

            /* 2️⃣ Register auth */
            await registerDieticianAuth({
                phone: formData.phone,
                password: formData.password as string,
            });

            alert("✅ Dietician added successfully!");
            router.push("/admin/dieticians");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to add dietician");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen gradient-bg flex flex-col lg:flex-row items-center justify-center p-6 gap-8 lg:gap-12">
            {/* Mobile Back */}
            <button
                onClick={() => router.push("/admin")}
                className="lg:hidden absolute top-4 left-4 text-green-500 text-2xl z-10"
            >
                <FaArrowLeft />
            </button>

            {/* Left Branding */}
            <motion.div
                className="flex flex-col justify-center items-center text-center lg:text-left lg:w-1/3 p-4 lg:p-6 lg:h-screen gap-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Image src="/full_logo.png" alt="Logo" width={250} height={250} />
                <h1 className={`${bebasNeue.className} text-3xl lg:text-5xl`}>
                    Add a New Dietician
                </h1>
                <p className={`${barlow.className} text-gray-700 text-base lg:text-xl`}>
                    Fill in dietician details to add them to the system.
                </p>
            </motion.div>

            {/* Right Form */}
            <motion.div
                ref={formRef}
                className="flex flex-col justify-between backdrop-blur-xl bg-white/70 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-black/10 lg:h-[90%] overflow-auto"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Progress */}
                <div className="flex justify-center mb-6 space-x-4">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-3 w-12 rounded-full ${s <= step ? "bg-green-500" : "bg-gray-300/40"
                                }`}
                        />
                    ))}
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <h2 className={`${sourceSans.className} text-3xl font-bold mb-4`}>
                            Dietician Details
                        </h2>

                        <div className="space-y-5">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full p-3 rounded-lg border"
                            />
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full p-3 rounded-lg border"
                            />
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full p-3 rounded-lg border"
                            />
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Location"
                                className="w-full p-3 rounded-lg border"
                            />

                            {/* Specialization */}
                            <div>
                                <div className="flex gap-2">
                                    <input
                                        value={specializationInput}
                                        onChange={(e) => setSpecializationInput(e.target.value)}
                                        placeholder="Specialization (e.g. Clinical Nutrition)"
                                        className="w-full p-3 rounded-lg border"
                                    />
                                    <button
                                        onClick={handleAddSpecialization}
                                        className="bg-green-500 text-white px-4 rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {formData.specialization.map((s, i) => (
                                        <span
                                            key={i}
                                            className="bg-green-100 px-3 py-1 rounded-full"
                                            onClick={() => handleRemoveSpecialization(i)}
                                        >
                                            {s} ×
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!isStep1Valid}
                            onClick={() => setStep(2)}
                            className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl"
                        >
                            Next →
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-3 rounded-lg border mb-4"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full p-3 rounded-lg border"
                        />
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(1)}>Back</button>
                            <button
                                disabled={!isStep2Valid}
                                onClick={() => setStep(3)}
                                className="bg-green-500 text-white px-6 py-2 rounded-xl"
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <p><b>Name:</b> {formData.name}</p>
                        <p><b>Email:</b> {formData.email}</p>
                        <p><b>Phone:</b> {formData.phone}</p>
                        <p><b>Location:</b> {formData.location}</p>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-6 bg-green-500 text-white py-3 rounded-xl"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
}
