"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyAdminToken } from "@/utils/api";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("admin_token");

      // Allow login page always
      if (pathname.startsWith("/admin/login")) {
        // If already logged in, redirect to /admin
        if (token) {
          try {
            await verifyAdminToken(token);
            router.replace("/admin");
            return;
          } catch {
            localStorage.removeItem("admin_token");
          }
        }
        setLoading(false);
        return;
      }

      // For other admin pages, require valid token
      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        await verifyAdminToken(token);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
      }
    };

    checkToken();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-2">Verifying admin access...</p>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
