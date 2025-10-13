"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyCoachToken } from "@/utils/api";

interface CoachLayoutProps {
  children: ReactNode;
}

export default function CoachLayout({ children }: CoachLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("coach_token");
      console.log("[CoachLayout] Current path:", pathname);
      console.log("[CoachLayout] Stored coach_token:", token);

      // Allow login page always
      if (pathname.startsWith("/coach/login")) {
        console.log("[CoachLayout] On login page");
        if (token) {
          try {
            console.log("[CoachLayout] Verifying existing token...");
            await verifyCoachToken(token);
            console.log("[CoachLayout] Token valid, redirecting to /coach");
            router.replace("/coach");
            return;
          } catch (err) {
            console.warn("[CoachLayout] Token invalid, removing from storage");
            localStorage.removeItem("coach_token");
          }
        }
        setLoading(false);
        return;
      }

      // For other coach pages, require valid token
      if (!token) {
        console.log("[CoachLayout] No token found, redirecting to /coach/login");
        router.replace("/coach/login");
        return;
      }

      try {
        console.log("[CoachLayout] Verifying token for protected page...");
        await verifyCoachToken(token);
        console.log("[CoachLayout] Token verified successfully");
        setLoading(false);
      } catch (err) {
        console.error("[CoachLayout] Token verification failed:", err);
        localStorage.removeItem("coach_token");
        router.replace("/coach/login");
      }
    };

    checkToken();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-2">Verifying coach access...</p>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
