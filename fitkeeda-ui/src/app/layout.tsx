import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "SportConnect",
  description: "Connecting residents and coaches for a healthy community",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-100">
        {children}
      </body>
    </html>
  );
}
