"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { createDieticianEnquiry, DieticianEnquiry } from "@/utils/api";
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaAppleAlt,
    FaArrowLeft,
    FaCheck,
    FaPlus,
    FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { bebasNeue, barlow } from "@/fonts";
import { useRouter } from "next/navigation";
import { GiPanda } from "react-icons/gi";

export default function DieticianEnquiryForm() {
    const router = useRouter();
    const formRef = useRef<HTMLDivElement>(null);

    const steps = ["Basic Info", "Specialization", "Confirm"];
    const [step, setStep] = useState(0);

    type DieticianEnquiryPayload = Omit<
        DieticianEnquiry,
        "_id" | "createdAt" | "updatedAt"
    >;

    const [form, setForm] = useState<DieticianEnquiryPayload>({
        type: "dietician",
        dieticianName: "",
        dieticianPhone: "",
        dieticianEmail: "",
        dieticianLocation: "",
        dieticianSpecialization: [],
    });

    const [specializationInput, setSpecializationInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [step]);

    const addSpecialization = () => {
        if (specializationInput.trim()) {
            setForm((prev) => ({
                ...prev,
                dieticianSpecialization: [
                    ...(prev.dieticianSpecialization || []),
                    specializationInput.trim(),
                ],
            }));
            setSpecializationInput("");
        }
    };

    const removeSpecialization = (index: number) => {
        setForm((prev) => ({
            ...prev,
            dieticianSpecialization: prev.dieticianSpecialization.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = async () => {
        if (!form.dieticianName.trim()) {
            alert("Please enter dietician name");
            return;
        }
        try {
            setLoading(true);
            await createDieticianEnquiry(form);
            alert("✅ Dietician enquiry submitted!");
            setForm({
                type: "dietician",
                dieticianName: "",
                dieticianPhone: "",
                dieticianEmail: "",
                dieticianLocation: "",
                dieticianSpecialization: [],
            });
            setSpecializationInput("");
            setStep(0);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to submit enquiry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen gradient-bg flex flex-col lg:flex-row items-center justify-center p-6 gap-8 lg:gap-12 relative">
            {/* Back */}
            <button
                onClick={() => router.push("/")}
                className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-md px-4 py-2 rounded-2xl text-blue-600 text-lg font-semibold hover:bg-blue-50 hover:text-blue-700 hover:scale-105 transition z-10"
            >
                <FaArrowLeft /> Back
            </button>

            {/* Left Branding + NEW PROFILE CARD */}
            <motion.div
                className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left lg:w-1/3 p-4 lg:p-6 lg:h-screen gap-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Image src="/full_logo.png" alt="Logo" width={250} height={250} />

                <div>
                    <h1 className={`${bebasNeue.className} text-3xl lg:text-5xl text-black`}>
                        Dietician Enquiry Form
                    </h1>
                    <p className={`${barlow.className} text-gray-700 text-base lg:text-xl`}>
                        Connect with societies looking for nutrition experts.
                    </p>
                </div>

                {/* --- ADDED: S M Hayat Profile Card --- */}
                <div className="w-full bg-white/60 backdrop-blur-md border border-white/40 p-5 rounded-2xl shadow-lg text-left mt-2 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-3 border-b border-gray-300 pb-3">
                        <div>
                            <h3 className="text-2xl font-bold text-blue-900">S M Hayat</h3>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold mt-1">
                                Weight Loss Expert
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-600 font-medium">Charges</p>
                            <p className="text-xl font-bold text-gray-900">₹2,000</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-gray-800 text-sm font-medium">
                            🎯 Expert in weight loss within <span className="font-bold text-blue-700">3 months</span>.
                        </p>

                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Limited Offer</span>
                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">First 20 Only</span>
                            </div>
                            <p className="text-sm text-gray-800 leading-snug font-semibold mt-2">
                                "No Results? No Problem! Get a <span className="text-green-600 font-bold">30% refund</span> within 25 days if it doesn't work for you."
                            </p>
                        </div>
                    </div>
                </div>
                {/* --- END ADDED SECTION --- */}

            </motion.div>

            {/* Right Form */}
            <motion.div
                ref={formRef}
                className="flex flex-col justify-between backdrop-blur-xl bg-white/70 p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-black/10 lg:h-[90%] overflow-auto"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Step Bar */}
                <div className="flex justify-center mb-6 space-x-4">
                    {steps.map((_, i) => (
                        <motion.div
                            key={i}
                            className={`h-3 w-12 rounded-full ${i <= step ? "bg-blue-600" : "bg-gray-300/40"
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: "3rem" }}
                            transition={{ duration: 0.4, delay: i * 0.2 }}
                        />
                    ))}
                </div>

                {/* Step 0 */}
                {step === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
                            <GiPanda className="text-blue-600" /> Basic Info
                        </h2>

                        <Input icon={<FaUser />} placeholder="Full Name" value={form.dieticianName}
                            onChange={(v: string) => setForm({ ...form, dieticianName: v })} />

                        <Input icon={<FaPhone />} placeholder="Phone" value={form.dieticianPhone}
                            onChange={(v: string) => setForm({ ...form, dieticianPhone: v })} />

                        <Input icon={<FaEnvelope />} placeholder="Email" value={form.dieticianEmail}
                            onChange={(v: string) => setForm({ ...form, dieticianEmail: v })} />

                        <Input icon={<FaMapMarkerAlt />} placeholder="Location" value={form.dieticianLocation}
                            onChange={(v: string) => setForm({ ...form, dieticianLocation: v })} />
                    </div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                    <div className="space-y-5">
                        <h2 className="text-2xl lg:text-3xl font-bold text-center flex items-center justify-center gap-2">
                            <FaAppleAlt className="text-blue-600" /> Specialization
                        </h2>

                        <div className="flex items-center border rounded-lg p-2">
                            <FaAppleAlt className="text-black mr-2" />
                            <input
                                type="text"
                                placeholder="Add specialization"
                                className="flex-1 p-2 outline-none bg-white"
                                value={specializationInput}
                                onChange={(e) => setSpecializationInput(e.target.value)}
                            />
                            <button
                                onClick={addSpecialization}
                                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                <FaPlus /> Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {form.dieticianSpecialization.map((s, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                                >
                                    {s}
                                    <button onClick={() => removeSpecialization(i)} className="text-red-500">
                                        <FaTimes />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="space-y-4">
                        <Confirm label="Name" value={form.dieticianName} />
                        <Confirm label="Phone" value={form.dieticianPhone} />
                        <Confirm label="Email" value={form.dieticianEmail} />
                        <Confirm label="Location" value={form.dieticianLocation} />
                        <Confirm label="Specialization" value={form.dieticianSpecialization.join(", ")} />
                    </div>
                )}

                {/* Nav */}
                <div className="flex justify-between mt-6">
                    {step > 0 && (
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-200 rounded-xl">
                            <FaArrowLeft /> Back
                        </button>
                    )}
                    {step < steps.length - 1 ? (
                        <button onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white rounded-xl">
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`px-6 py-3 rounded-xl flex items-center gap-2 ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                } text-white`}
                        >
                            <FaCheck /> {loading ? "Submitting..." : "Submit"}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

/* helpers */
const Input = ({ icon, placeholder, value, onChange }: any) => (
    <div className="relative">
        {/* Icon color changed to dark gray */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">{icon}</span>
        <input
            // Added: bg-gray-50, text-black, placeholder-gray-600
            className="w-full p-3 pl-10 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-600 bg-gray-50 text-black placeholder-gray-600"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const Confirm = ({ label, value }: any) => (
    // Added: text-black to ensure confirmation text is also visible
    <div className="bg-white p-4 rounded-lg border border-blue-300 shadow-sm text-black">
        <b className="text-blue-900">{label}:</b> {value}
    </div>
);
