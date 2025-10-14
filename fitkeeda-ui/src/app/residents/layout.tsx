"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
 // optional spinner component

export default function ResidentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Allow public route: /residents/auth-resident
    if (pathname === "/residents/auth-resident") {
      setLoading(false);
      return;
    }

    // Check for token in localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // No token → redirect to auth page
      router.replace("/auth-resident");
    } else {
      // Token exists → optionally verify expiry
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("token");
          router.replace("/auth-resident");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        router.replace("/residents/auth-resident");
      }
    }
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-2">Verifying resident access...</p>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
