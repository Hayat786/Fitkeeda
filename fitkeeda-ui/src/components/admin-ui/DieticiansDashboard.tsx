"use client";
import { useRouter } from "next/navigation";

export default function DieticiansDashboard() {
    const router = useRouter();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dieticians</h1>

            <div className="flex gap-4">
                <button
                    onClick={() => router.push("/admin/dieticians/all")}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    View All Dieticians
                </button>

                <button
                    onClick={() => router.push("/admin/dieticians/new")}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Add New Dietician
                </button>
            </div>
        </div>
    );
}
