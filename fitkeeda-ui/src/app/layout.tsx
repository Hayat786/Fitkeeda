// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Fitkeeda",
  description: "Building healthier communities",
  applicationName: "Fitkeeda",
  icons: {
    icon: [
      // { url: "/favicon.ico", sizes: "any" }, // default
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon-apple.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Fitkeeda",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Fitkeeda",
    description: "Building healthier communities",
    url: "https://fitkeeda.com",
    siteName: "Fitkeeda",
    images: [
      {
        url: "/favicon-512x512.png",
        width: 512,
        height: 512,
        alt: "Fitkeeda Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Fitkeeda",
    description: "Building healthier communities",
    images: ["/favicon-512x512.png"],
    creator: "@fitkeeda",
  },
};

// ✅ themeColor must be exported separately
export const viewport: Viewport = {
  themeColor: "#ffffff", // replace with Fitkeeda brand color if needed
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon for desktop and Android */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />

        {/* Apple devices (iPhone, iPad) */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-apple.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon-apple.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon-apple.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon-apple.png" />

        {/* Manifest for PWA / Android */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#ffffff" />

        {/* Optional Safari pinned tab icon */}
        <link rel="mask-icon" href="/favicon-apple.png" color="#5bbad5" />
      </head>
      <body>{children}</body>
    </html>
  );
}

